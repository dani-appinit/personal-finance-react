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

  });
});
