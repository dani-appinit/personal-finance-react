import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Stack,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { TransactionList } from '../components/TransactionList';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionFilters } from '../components/TransactionFilters';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions';
import { useAlert } from '../../../shared/services/alert.service';
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
  SortField,
  SortOrder,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../types/transaction.types';
import { useTranslate } from '../../../shared/i18n/useTranslate';
import { FinancialSummary } from '../components/FinancialSummary';

export const TransactionSection: React.FC = () => {
  const translate = useTranslate();
  const { showConfirm, showSuccess, showError } = useAlert();
  const [modalState, setModalState] = useState<{ isOpen: boolean; transaction?: Transaction }>({
    isOpen: false,
  });
  const [filters, setFilters] = useState<{
    type?: TransactionType;
    category?: TransactionCategory;
  }>({});
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder }>({
    field: 'date',
    order: 'desc',
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const { transactions } = useTransactions(filters, sort.field, sort.order);
  const handleAddClick = () => {
    setModalState({ isOpen: true });
  };

  const handleEditClick = (transaction: Transaction) => {
    setModalState({ isOpen: true, transaction });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false });
  };

  const handleSubmit = async (data: CreateTransactionDto | UpdateTransactionDto) => {
    try {
      if (modalState.transaction) {
        await updateMutation.mutateAsync({
          id: modalState.transaction.id,
          data,
        });
        showSuccess(translate('transactions.updateSuccess'));
      } else {
        await createMutation.mutateAsync(data as CreateTransactionDto);
        showSuccess(translate('transactions.createSuccess'));
      }
      handleCloseModal();
    } catch (error: unknown) {
      const errorMessage = modalState.transaction 
        ? translate('transactions.updateError')
        : translate('transactions.createError');
      showError(error instanceof Error ? error?.message : errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      translate('transactions.confirmDeleteMessage') || 'Are you sure you want to delete this transaction?',
      async () => {
        try {
          await deleteMutation.mutateAsync(id);
          showSuccess(translate('transactions.deleteSuccess') || 'Transaction deleted successfully');
        } catch (error) {
          console.error('Error deleting transaction:', error);
          showError(translate('transactions.deleteError') || 'Error deleting transaction');
        }
      },
      {
        title: translate('transactions.confirmDeleteTitle') || 'Delete Transaction',
        confirmText: translate('form.delete') || 'Delete',
        cancelText: translate('form.cancel'),
      }
    );
  };
  return (
    <Box>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {translate('dashboard.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          size="large"
        >
          {translate('dashboard.newTransaction')}
        </Button>
      </Stack>

      {/* Transactions Section */}
      <Paper sx={{ p: 3 }}>
        <FinancialSummary />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {translate('transactions.title')}
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <TransactionFilters
            filters={filters}
            sort={sort}
            onFilterChange={setFilters}
            onSortChange={setSort}
          />
        </Box>

        {/* Transactions List - global spinner handles loading state */}
        <TransactionList
          transactions={transactions}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        
        />
      </Paper>

      {/* Transaction Form Modal */}
      <Dialog open={modalState.isOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modalState.transaction ? translate('form.editTransaction') : translate('form.newTransaction')}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TransactionForm
            transaction={modalState?.transaction}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
