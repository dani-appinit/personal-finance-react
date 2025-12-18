import apiClient from '../../../shared/config/apiClient';
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  SortField,
  SortOrder,
} from '../types/transaction.types';
import type { GenericResponse } from '../../auth/types/auth.types';

const STORAGE_KEY = 'transactions_cache';

export class TransactionService {
  private static getFromLocalStorage(userId: string): Transaction[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveToLocalStorage(userId: string, transactions: Transaction[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static async getAll(userId: string): Promise<Transaction[]> {
    const localTransactions = this.getFromLocalStorage(userId);
    
    // Si localStorage está vacío, obtener de API y guardar
    if (localTransactions.length === 0) {
      try {
        const response = await apiClient.get<GenericResponse<Transaction[]>>(`/users/${userId}/transactions`);
        const apiTransactions = response.data.resp || [];
        
        if (apiTransactions.length > 0) {
          this.saveToLocalStorage(userId, apiTransactions);
          return apiTransactions;
        }
      } catch (error) {
        console.warn('⚠️ API call failed:', error);
      }
    }
    
    return localTransactions;
  }

  static async getById(id: string): Promise<Transaction> {
    const response = await apiClient.get<{ transaction: Transaction }>(`/transactions/${id}`);
    return response.data.transaction;
  }

  static async create(userId: string, data: CreateTransactionDto): Promise<Transaction> {
    // Crear transacción localmente primero
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const currentTransactions = this.getFromLocalStorage(userId);
    const updatedTransactions = [...currentTransactions, newTransaction];
    this.saveToLocalStorage(userId, updatedTransactions);
    
    
    // Llamar a la API en background (no bloqueante)
    try {
      await apiClient.post<{ transaction: Transaction }>(`/users/${userId}/transactions`, data);
    } catch (error) {
      console.warn('⚠️ API call failed, but localStorage is updated:', error);
    }
    
    return newTransaction;
  }

  static async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    // Actualizar localStorage primero
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    
    if (!userId) throw new Error('User not found');
    
    const currentTransactions = this.getFromLocalStorage(userId);
    const updatedTransactions = currentTransactions.map((t) =>
      t.id === id
        ? { ...t, ...data, updatedAt: new Date().toISOString() }
        : t
    );
    this.saveToLocalStorage(userId, updatedTransactions);
    
    const updatedTransaction = updatedTransactions.find((t) => t.id === id)!;
    
    // Llamar a la API en background
    try {
      await apiClient.put<{ transaction: Transaction }>(`/transactions/${id}`, data);
    } catch (error) {
      console.warn('⚠️ API call failed, but localStorage is updated:', error);
    }
    
    return updatedTransaction;
  }

  static async delete(id: string): Promise<void> {
    // Eliminar de localStorage primero
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    
    if (userId) {
      const currentTransactions = this.getFromLocalStorage(userId);
      const updatedTransactions = currentTransactions.filter((t) => t.id !== id);
      this.saveToLocalStorage(userId, updatedTransactions);
      
    }
    
    // Llamar a la API en background
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      console.warn('⚠️ API call failed, but localStorage is updated:', error);
    }
  }

  static filterTransactions(
    transactions: Transaction[],
    filters: TransactionFilters
  ): Transaction[] {
    return transactions.filter((transaction) => {
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.startDate && transaction.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && transaction.date > filters.endDate) {
        return false;
      }
      return true;
    });
  }

  static sortTransactions(
    transactions: Transaction[],
    field: SortField,
    order: SortOrder
  ): Transaction[] {
    return [...transactions].sort((a, b) => {
      let aValue: string | number = a[field];
      let bValue: string | number = b[field];

      if (field === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
