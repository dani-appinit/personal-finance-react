import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  SortField,
  SortOrder,
} from '../types/transaction.types';
import { useAppSelector } from '../../../store/hooks';
import { useMemo } from 'react';
import { TransactionService } from '../services/transaction.service';

export const TRANSACTIONS_QUERY_KEY = 'transactions';

export const useTransactions = (filters?: TransactionFilters, sortField?: SortField, sortOrder?: SortOrder) => {
  const user = useAppSelector((state) => state.auth.user);
  
  const query = useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, user?.id],
    queryFn: () => TransactionService.getAll(user!.id),
    enabled: !!user,
  });

  const filteredAndSortedTransactions = useMemo(() => {
    if (!query.data) return [];
    
    let result = [...query.data];
    
    if (filters) {
      result = TransactionService.filterTransactions(result, filters);
    }
    
    if (sortField && sortOrder) {
      result = TransactionService.sortTransactions(result, sortField, sortOrder);
    }
    
    return result;
  }, [query.data, filters, sortField, sortOrder]);

  return {
    ...query,
    transactions: filteredAndSortedTransactions,
  };
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => 
      TransactionService.create(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      TransactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
    },
  });
};

export const useTransactionSummary = () => {
  const { transactions, isLoading } = useTransactions();

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }, [transactions]);

  return { summary, isLoading };
};
