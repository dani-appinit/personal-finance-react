import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionService } from '../services/transaction.service';
import type { Transaction } from '../types/transaction.types';

// Hoisted spies for apiClient mock
const { getSpy, postSpy, putSpy, deleteSpy } = vi.hoisted(() => ({
  getSpy: vi.fn(),
  postSpy: vi.fn(),
  putSpy: vi.fn(),
  deleteSpy: vi.fn(),
}));

vi.mock('../../../shared/config/apiClient', () => ({
  default: {
    get: getSpy,
    post: postSpy,
    put: putSpy,
    delete: deleteSpy,
  },
}));

const sample: Transaction[] = [
  {
    id: '1', title: 'Salary', amount: 1000, type: 'income', category: 'freelance', date: '2024-01-10', userId: 'u1', createdAt: '2024-01-10', updatedAt: '2024-01-10'
  },
  {
    id: '2', title: 'Groceries', amount: 150, type: 'expense', category: 'food', date: '2024-01-12', userId: 'u1', createdAt: '2024-01-12', updatedAt: '2024-01-12'
  },
];

describe('TransactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // auth user for update/delete
    localStorage.setItem('auth_user', JSON.stringify({ id: 'u1' }));
  });

  it('getAll returns from localStorage if present, otherwise caches API response', async () => {
    // Initially empty → API returns data
    getSpy.mockResolvedValueOnce({ data: { resp: sample } });
    const first = await TransactionService.getAll('u1');
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(first).toEqual(sample);

    // Now localStorage should have been saved; second call should read from local without API
    getSpy.mockClear();
    const second = await TransactionService.getAll('u1');
    expect(getSpy).not.toHaveBeenCalled();
    expect(second).toEqual(sample);
  });

  it('create adds to localStorage and calls API in background', async () => {
    postSpy.mockResolvedValueOnce({ data: { transaction: {} } });
    const created = await TransactionService.create('u1', {
      title: 'Bonus', amount: 200, type: 'income', category: 'freelance', date: '2024-01-15'
    });

    expect(created.title).toBe('Bonus');
    const stored = JSON.parse(localStorage.getItem('transactions_cache_u1') || '[]');
    expect(stored.find((t: Transaction) => t.id === created.id)).toBeTruthy();
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it('update modifies localStorage and calls API', async () => {
    // Seed local storage
    localStorage.setItem('transactions_cache_u1', JSON.stringify(sample));
    putSpy.mockResolvedValueOnce({ data: { transaction: {} } });
    const updated = await TransactionService.update('2', { title: 'Groceries+', amount: 160, type: 'expense', category: 'food', date: '2024-01-12' });
    expect(updated.title).toBe('Groceries+');
    const stored = JSON.parse(localStorage.getItem('transactions_cache_u1') || '[]');
    const t2 = stored.find((t: Transaction) => t.id === '2');
    expect(t2.title).toBe('Groceries+');
    expect(putSpy).toHaveBeenCalledTimes(1);
  });

  it('delete removes from localStorage and calls API', async () => {
    localStorage.setItem('transactions_cache_u1', JSON.stringify(sample));
    deleteSpy.mockResolvedValueOnce({});
    await TransactionService.delete('1');
    const stored = JSON.parse(localStorage.getItem('transactions_cache_u1') || '[]');
    expect(stored.some((t: Transaction) => t.id === '1')).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('filterTransactions and sortTransactions work as expected', () => {
    const filtered = TransactionService.filterTransactions(sample, { type: 'income' });
    expect(filtered).toEqual([sample[0]]);

    const sortedAsc = TransactionService.sortTransactions(sample, 'amount', 'asc');
    expect(sortedAsc.map(t => t.id)).toEqual(['2', '1']);

    const sortedDateDesc = TransactionService.sortTransactions(sample, 'date', 'desc');
    expect(sortedDateDesc.map(t => t.id)).toEqual(['2', '1']);
  });
});
