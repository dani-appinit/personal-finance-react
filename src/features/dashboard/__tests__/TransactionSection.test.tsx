import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TransactionSection } from '../pages/TransactionSection';

// Mock translate
vi.mock('../../../shared/i18n/useTranslate', () => ({
  useTranslate: () => (key: string) => {
    const map: Record<string, string> = {
      'dashboard.title': 'Dashboard',
      'dashboard.newTransaction': 'New Transaction',
      'transactions.title': 'Transactions',
      'transactions.updateSuccess': 'Updated',
      'transactions.createSuccess': 'Created',
      'transactions.updateError': 'Update error',
      'transactions.createError': 'Create error',
      'transactions.confirmDeleteMessage': 'Confirm delete?',
      'transactions.confirmDeleteTitle': 'Delete Transaction',
      'form.delete': 'Delete',
      'form.cancel': 'Cancel',
      'form.editTransaction': 'Edit Transaction',
      'form.newTransaction': 'New Transaction',
      'form.update': 'Update',
      'form.add': 'Add',
    };
    return map[key] ?? key;
  },
}));

// Capture showConfirm calls
const showConfirmSpy = vi.fn();
const showSuccessSpy = vi.fn();
const showErrorSpy = vi.fn();
vi.mock('../../../shared/services/alert.service', () => ({
  useAlert: () => ({
    showConfirm: showConfirmSpy,
    showSuccess: showSuccessSpy,
    showError: showErrorSpy,
  }),
}));

// Spies for mutations
const createSpy = vi.fn();
let createPending = false;
const updateSpy = vi.fn();
let updatePending = false;
const deleteSpy = vi.fn();
let deletePending = false;

// Mock hooks used by TransactionSection
const sampleTransactions = [
  { id: 't1', title: 'Salary', amount: 1000, type: 'income', category: 'freelance', date: '2024-01-10', userId: 'u1', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: 't2', title: 'Groceries', amount: 150, type: 'expense', category: 'food', date: '2024-01-12', userId: 'u1', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
];

vi.mock('../hooks/useTransactions', () => ({
  useTransactions: () => ({ transactions: sampleTransactions }),
  useCreateTransaction: () => ({ mutateAsync: createSpy, isPending: createPending }),
  useUpdateTransaction: () => ({ mutateAsync: updateSpy, isPending: updatePending }),
  useDeleteTransaction: () => ({ mutateAsync: deleteSpy, isPending: deletePending }),
}));

// Mock child components to simplify interactions
vi.mock('../components/TransactionList', () => ({
  TransactionList: ({ transactions, onEdit, onDelete }: any) => (
    <div>
      {transactions.map((t: any) => (
        <div key={t.id}>
          <span>{t.title}</span>
          <button aria-label={`edit-${t.id}`} onClick={() => onEdit(t)}>Edit</button>
          <button aria-label={`delete-${t.id}`} onClick={() => onDelete(t.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../components/TransactionForm', () => ({
  TransactionForm: ({ transaction, onSubmit, onCancel, isLoading }: any) => (
    <div>
      <button aria-label="submit" onClick={() => onSubmit({ title: 'X', amount: 123, type: 'income', category: 'other', date: '2024-01-01' })} disabled={isLoading}>Submit</button>
      <button aria-label="cancel" onClick={onCancel}>Cancel</button>
      {transaction && <span data-testid="editing">editing {transaction.id}</span>}
    </div>
  ),
}));

vi.mock('../components/TransactionFilters', () => ({
  TransactionFilters: () => null,
}));

vi.mock('../components/FinancialSummary', () => ({
  FinancialSummary: () => null,
}));

const renderSection = () => {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <TransactionSection />
    </QueryClientProvider>
  );
};

describe('TransactionSection', () => {
  beforeEach(() => {
    showConfirmSpy.mockClear();
    showSuccessSpy.mockClear();
    showErrorSpy.mockClear();
    createSpy.mockClear();
    updateSpy.mockClear();
    deleteSpy.mockClear();
    createPending = false;
    updatePending = false;
    deletePending = false;
  });

  it('renders header and New Transaction button', () => {
    renderSection();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Transaction/i })).toBeInTheDocument();
  });

  it('opens dialog to create and calls create mutation on submit', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole('button', { name: /New Transaction/i }));
    // Dialog opens and shows mocked form submit button
    const submitBtn = await screen.findByRole('button', { name: /Submit/i });
    await user.click(submitBtn);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({ title: 'X', amount: 123, type: 'income', category: 'other', date: '2024-01-01' });
  });

  it('opens dialog to edit and calls update mutation on submit', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByLabelText('edit-t2'));
    expect(screen.getByTestId('editing')).toHaveTextContent('editing t2');
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitBtn);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({ id: 't2', data: { title: 'X', amount: 123, type: 'income', category: 'other', date: '2024-01-01' } });
  });

  it('triggers confirm on delete and calls delete mutation when confirmed', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByLabelText('delete-t1'));
    expect(showConfirmSpy).toHaveBeenCalledTimes(1);
    const onConfirm = showConfirmSpy.mock.calls[0][1];
    await onConfirm();

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith('t1');
  });

  it('disables submit while update is pending', async () => {
    updatePending = true;
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByLabelText('edit-t1'));
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeDisabled();
  });
});
