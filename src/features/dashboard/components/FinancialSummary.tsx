import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, BarChart as BarChartIcon, Info } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTransactionSummary } from '../hooks/useTransactions';
import { formatCurrency } from '../../../shared/utils/format';
import { useTranslate } from '../../../shared/i18n/useTranslate';

export const FinancialSummary: React.FC = () => {
  //*** Translation */
  const { summary } = useTransactionSummary();
  const translate = useTranslate();



  const [showChart, setShowChart] = useState(false);



  const summaryItems = [
    {
      title: translate('summary.totalIncome'),
      amount: summary.totalIncome,
      icon: TrendingUp,
      bgColor: 'success.light',
      iconColor: 'success.dark',
      textColor: 'success.main',
    },
    {
      title: translate('summary.totalExpenses'),
      amount: summary.totalExpenses,
      icon: TrendingDown,
      bgColor: 'error.light',
      iconColor: 'error.dark',
      textColor: 'error.main',
    },
    {
      title: translate('summary.netBalance'),
      amount: summary.balance,
      icon: AccountBalance,
      bgColor: summary.balance >= 0 ? 'primary.light' : 'warning.light',
      iconColor: summary.balance >= 0 ? 'primary.dark' : 'warning.dark',
      textColor: summary.balance >= 0 ? 'primary.main' : 'warning.main',
    },
  ];

  const chartData = [
    { id: 0, value: summary.totalIncome, label: translate('summary.totalIncome'), color: '#4caf50' },
    { id: 1, value: summary.totalExpenses, label: translate('summary.totalExpenses'), color: '#f44336' },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={showChart ? <Info /> : <BarChartIcon />}
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? 'Ver Información' : 'Ver Gráfica'}
        </Button>
      </Box>

      {showChart ? (
        <Card elevation={2}>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center items-center min-h-[300px]">
                <PieChart
                  series={[
                    {
                      data: chartData,
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 5,
                      highlightScope: { fade: 'global', highlight: 'item' },
                    },
                  ]}
                  width={400}
                  height={300}
                />
              </div>
              <div className="lg:pl-4">
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Resumen Financiero
                </Typography>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <Typography variant="body2" color="text.secondary">
                        {translate('summary.totalIncome')}
                      </Typography>
                    </div>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {formatCurrency(summary.totalIncome)}
                    </Typography>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <Typography variant="body2" color="text.secondary">
                        {translate('summary.totalExpenses')}
                      </Typography>
                    </div>
                    <Typography variant="h5" fontWeight="bold" color="error.main">
                      {formatCurrency(summary.totalExpenses)}
                    </Typography>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {translate('summary.netBalance')}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={summary.balance >= 0 ? 'primary.main' : 'warning.main'}
                    >
                      {formatCurrency(summary.balance)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="w-full">
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color={item.textColor}>
                          {formatCurrency(item.amount)}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: item.bgColor,
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: item.iconColor }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
};
