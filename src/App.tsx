import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './shared/theme/theme';
import { store } from './store/index';
import { useAppSelector } from './store/hooks';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardLayout } from './shared/layouts/DashboardLayout';
import { AlertProvider } from './shared/services/alert.service';
import { GlobalSpinner } from './shared/components/globalSpinner/GlobalSpinner';
import { TransactionSection } from './features/dashboard/pages/TransactionSection';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<TransactionSection />} />
          </Route>
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 - Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppWithTheme() {
  const { themeMode, themeColor } = useAppSelector((state) => state.preferences);
  
  const theme = useMemo(
    () => createAppTheme(themeMode, themeColor),
    [themeMode, themeColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <GlobalSpinner minDurationMs={1000} />
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </AlertProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppWithTheme />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
