import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import type { Transaction, TransactionCategory } from '../types/transaction.types';
import { useTranslate } from '../../../shared/i18n/useTranslate';
import { translateError } from '../../../shared/i18n/translateError';
// Removed currency formatting for simpler numeric input

const transactionSchema = z.object({
  title: z.string().min(1, 'form.titleRequired').max(100, 'form.titleTooLong'),
  amount: z.number().positive('form.amountPositive').min(0, 'form.amountMin'),
  type: z.enum(['income', 'expense']),
  category: z.enum([
    'salary',
    'freelance',
    'investment',
    'food',
    'transport',
    'entertainment',
    'utilities',
    'healthcare',
    'shopping',
    'other',
  ]),
  date: z.string().min(1, 'form.dateRequired'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const translate = useTranslate();

  const INCOME_CATEGORIES: Array<{ value: TransactionCategory; label: string }> = [
    { value: 'freelance', label: translate('categories.freelance') },
    { value: 'investment', label: translate('categories.investment') },
    { value: 'other', label: translate('categories.other') },
  ];

  const EXPENSE_CATEGORIES: Array<{ value: TransactionCategory; label: string }> = [
    { value: 'food', label: translate('categories.food') },
    { value: 'transport', label: translate('categories.transport') },
    { value: 'entertainment', label: translate('categories.entertainment') },
    { value: 'utilities', label: translate('categories.utilities') },
    { value: 'healthcare', label: translate('categories.healthcare') },
    { value: 'shopping', label: translate('categories.shopping') },
    { value: 'other', label: translate('categories.other') },
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
        }
      : {
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
        },
  });

  const transactionType = watch('type');
  const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Simplified: no formatted display state; rely on numeric input only

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ pt: 1 }}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={translate('form.title')}
              placeholder="Ex: Monthly Salary"
              fullWidth
              error={!!errors.title}
              helperText={translateError(errors.title?.message, translate)}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={translate('form.amount')}
              type="number"
              fullWidth
              inputMode="decimal"
              value={field.value ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                field.onChange(v === '' ? undefined : Number(v));
              }}
              error={!!errors.amount}
              helperText={translateError(errors.amount?.message, translate)}
              placeholder="0.00"
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label={translate('form.type')}
              fullWidth
              error={!!errors.type}
              helperText={translateError(errors.type?.message, translate)}
            >
              <MenuItem value="income">{translate('types.income')}</MenuItem>
              <MenuItem value="expense">{translate('types.expense')}</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label={translate('form.category')}
              fullWidth
              error={!!errors.category}
              helperText={translateError(errors.category?.message, translate)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={translate('form.date')}
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={translateError(errors.date?.message, translate)}
            />
          )}
        />

        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {transaction ? translate('form.update') : translate('form.add')}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
          >
            {translate('form.cancel')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
