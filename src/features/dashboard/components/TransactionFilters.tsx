import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useTranslate } from '../../../shared/i18n/useTranslate';
import type { TransactionType, TransactionCategory, SortField, SortOrder } from '../types/transaction.types';

interface TransactionFiltersProps {
  filters: {
    type?: TransactionType;
    category?: TransactionCategory;
  };
  sort: {
    field: SortField;
    order: SortOrder;
  };
  onFilterChange: (filters: { type?: TransactionType; category?: TransactionCategory }) => void;
  onSortChange: (sort: { field: SortField; order: SortOrder }) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  sort,
  onFilterChange,
  onSortChange,
}) => {
  const translate = useTranslate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TextField
        select
        label={translate('form.type')}
        value={filters.type || ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            type: e.target.value ? (e.target.value as TransactionType) : undefined,
          })
        }
        fullWidth
      >
        <MenuItem value="">{translate('filters.allTypes')}</MenuItem>
        <MenuItem value="income">{translate('types.income')}</MenuItem>
        <MenuItem value="expense">{translate('types.expense')}</MenuItem>
      </TextField>

      <TextField
        select
        label={translate('form.category')}
        value={filters.category || ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            category: e.target.value ? (e.target.value as TransactionCategory) : undefined,
          })
        }
        fullWidth
      >
        <MenuItem value="">{translate('filters.allCategories')}</MenuItem>
        <MenuItem value="salary">{translate('categories.salary')}</MenuItem>
        <MenuItem value="freelance">{translate('categories.freelance')}</MenuItem>
        <MenuItem value="investment">{translate('categories.investment')}</MenuItem>
        <MenuItem value="food">{translate('categories.food')}</MenuItem>
        <MenuItem value="transport">{translate('categories.transport')}</MenuItem>
        <MenuItem value="entertainment">{translate('categories.entertainment')}</MenuItem>
        <MenuItem value="utilities">{translate('categories.utilities')}</MenuItem>
        <MenuItem value="healthcare">{translate('categories.healthcare')}</MenuItem>
        <MenuItem value="shopping">{translate('categories.shopping')}</MenuItem>
        <MenuItem value="other">{translate('categories.other')}</MenuItem>
      </TextField>

      <TextField
        select
        label={translate('filters.sortBy')}
        value={sort.field}
        onChange={(e) =>
          onSortChange({
            ...sort,
            field: e.target.value as SortField,
          })
        }
        fullWidth
      >
        <MenuItem value="date">{translate('filters.date')}</MenuItem>
        <MenuItem value="amount">{translate('filters.amount')}</MenuItem>
        <MenuItem value="title">{translate('filters.title')}</MenuItem>
      </TextField>

      <TextField
        select
        label={translate('filters.order')}
        value={sort.order}
        onChange={(e) =>
          onSortChange({
            ...sort,
            order: e.target.value as SortOrder,
          })
        }
        fullWidth
      >
        <MenuItem value="desc">{translate('filters.descending')}</MenuItem>
        <MenuItem value="asc">{translate('filters.ascending')}</MenuItem>
      </TextField>
    </div>
  );
};
