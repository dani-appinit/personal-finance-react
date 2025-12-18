import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { TransactionList } from '../components/TransactionList';
import type { Transaction } from '../types/transaction.types';

// Mock translate to predictable strings
const t = (key: string) => ({
  'transactions.noTransactions': 'No transactions',
  'transactions.getStarted': 'Get started',
  'form.title': 'Title',
  'form.amount': 'Amount',
  'form.type': 'Type',
  'form.category': 'Category',
  'form.date': 'Date',
  'transactions.actions': 'Actions',
  'types.income': 'Income',
  'types.expense': 'Expense',
  'categories.freelance': 'Freelance',
  'categories.food': 'Food',
}[key] ?? key);

vi.mock('../../../shared/i18n/useTranslate', () => ({
  useTranslate: () => t,
}));

// Mock currency formatter for deterministic output
vi.mock('../../../shared/utils/format', () => ({
  formatCurrency: (value: number) => `$${value.toFixed(2)}`,
}));

describe('TransactionList', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Salary',
      amount: 1000,
      type: 'income',
      category: 'freelance',
      date: '2024-01-10',
      userId: 'u1',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: '2',
      title: 'Groceries',
      amount: 150,
      type: 'expense',
      category: 'food',
      date: '2024-01-12',
      userId: 'u1',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state message when no transactions', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<TransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('No transactions')).toBeInTheDocument();
    expect(screen.getByText('Get started')).toBeInTheDocument();
  });

  it('renders rows and formatted data', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />);

    // headers
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // rows
    const salaryRow = screen.getByText('Salary').closest('tr')!;
    const salaryCells = within(salaryRow).getAllByRole('cell');
    expect(salaryCells[1]).toHaveTextContent('+$1000.00');
    expect(within(salaryRow).getByText('Freelance')).toBeInTheDocument();
    expect(within(salaryRow).getByText('10/01/2024')).toBeInTheDocument();

    const groceriesRow = screen.getByText('Groceries').closest('tr')!;
    const groceriesCells = within(groceriesRow).getAllByRole('cell');
    expect(groceriesCells[1]).toHaveTextContent('-$150.00');
    expect(within(groceriesRow).getByText('Food')).toBeInTheDocument();
    expect(within(groceriesRow).getByText('12/01/2024')).toBeInTheDocument();
  });

  it('calls onEdit and onDelete when action buttons are clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />);

    const salaryRow = screen.getByText('Salary').closest('tr')!;
    const buttons = within(salaryRow).getAllByRole('button');
    // Order: Edit, Delete
    await user.click(buttons[0]);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(transactions[0]);

    await user.click(buttons[1]);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
