import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { TransactionForm } from '../components/TransactionForm';
import type { Transaction } from '../types/transaction.types';

// Mock translation and error translator
const t = (key: string) => ({
  'form.title': 'Title',
  'form.amount': 'Amount',
  'form.type': 'Type',
  'form.category': 'Category',
  'form.date': 'Date',
  'types.income': 'Income',
  'types.expense': 'Expense',
  'categories.freelance': 'Freelance',
  'categories.investment': 'Investment',
  'categories.food': 'Food',
  'categories.transport': 'Transport',
  'categories.entertainment': 'Entertainment',
  'categories.utilities': 'Utilities',
  'categories.healthcare': 'Healthcare',
  'categories.shopping': 'Shopping',
  'categories.other': 'Other',
  'form.add': 'Add',
  'form.update': 'Update',
  'form.cancel': 'Cancel',
}[key] ?? key);

vi.mock('../../../shared/i18n/useTranslate', () => ({
  useTranslate: () => t,
}));

vi.mock('../../../shared/i18n/translateError', () => ({
  translateError: (msg: string | undefined, translate: (k: string) => string) => (msg ? translate(msg) : ''),
}));

describe('TransactionForm', () => {
  it('submits new transaction data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TransactionForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill fields
    await user.type(screen.getByLabelText('Title'), 'Buy apples');
    await user.type(screen.getByLabelText('Amount'), '12.5');
    // Select Type: Expense
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByRole('option', { name: 'Expense' }));
    // Select Category: Food
    await user.click(screen.getByLabelText('Category'));
    await user.click(screen.getByRole('option', { name: 'Food' }));
    // Date default is today; set explicit
    await user.clear(screen.getByLabelText('Date'));
    await user.type(screen.getByLabelText('Date'), '2024-02-01');

    // Submit
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Buy apples',
      amount: 12.5,
      type: 'expense',
      category: 'food',
      date: '2024-02-01',
    }, expect.anything());
  });

  it('shows Update label and disables buttons when loading', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    const transaction: Transaction = {
      id: 't1',
      title: 'Old title',
      amount: 20,
      type: 'income',
      category: 'freelance',
      date: '2024-01-01',
      userId: 'u1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    render(
      <TransactionForm transaction={transaction} onSubmit={onSubmit} onCancel={onCancel} isLoading />
    );

    const submitBtn = screen.getByRole('button', { name: 'Update' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    expect(submitBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();

    // Disabled buttons shouldn't be clickable; just verify disabled state
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('switches categories when type changes', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(<TransactionForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Default is expense → contains Food
    // Open type select and choose Income
    await user.click(screen.getByLabelText('Type'));
    await user.click(screen.getByRole('option', { name: 'Income' }));
    // After switching to income, categories should include Freelance
    await user.click(screen.getByLabelText('Category'));
    await user.click(screen.getByRole('option', { name: 'Freelance' }));
    expect(screen.getByLabelText('Category')).toHaveTextContent('Freelance');
  });
});
