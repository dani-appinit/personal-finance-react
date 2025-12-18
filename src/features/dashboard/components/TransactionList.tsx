import React from 'react';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, Description } from '@mui/icons-material';
import { formatCurrency } from '../../../shared/utils/format';
import type { TranslationKey } from '../../../shared/i18n/translations';
import type { Transaction } from '../types/transaction.types';
import { useTranslate } from '../../../shared/i18n/useTranslate';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const translate = useTranslate();

  if (transactions.length === 0) {
    return (
      <Paper sx={{ p: 8, textAlign: 'center' }}>
        <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {translate('transactions.noTransactions')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {translate('transactions.getStarted')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translate('form.title')}</TableCell>
              <TableCell>{translate('form.amount')}</TableCell>
              <TableCell>{translate('form.type')}</TableCell>
              <TableCell>{translate('form.category')}</TableCell>
              <TableCell>{translate('form.date')}</TableCell>
              <TableCell align="right">{translate('transactions.actions')}</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {transaction.title}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={translate(`types.${transaction.type}` as TranslationKey)}
                  size="small"
                  color={transaction.type === 'income' ? 'success' : 'error'}
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {translate(`categories.${transaction.category}` as TranslationKey)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(transaction.date).format('DD/MM/YYYY')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </Box>
  );
};
