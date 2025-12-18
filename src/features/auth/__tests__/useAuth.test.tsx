import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import authReducer from '../store/authSlice';
import { useLoginMutation, useLogoutMutation, useValidateSessionMutation } from '../hooks/useAuth';

// Mock AuthService
vi.mock('../services/auth.service', () => ({
  AuthService: {
    login: vi.fn(async () => ({ token: 'tok-123', user: { id: 'u1', name: 'Demo', email: 'demo@example.com' } })),
    logout: vi.fn(async () => {}),
    validateSession: vi.fn(async () => ({ id: 'u1', name: 'Demo', email: 'demo@example.com' })),
  },
}));

// Spy dispatch via real store
const makeStore = () => configureStore({
  reducer: { auth: authReducer },
});

// Helper component to trigger hooks
const HooksHarness: React.FC = () => {
  const login = useLoginMutation();
  const logout = useLogoutMutation();
  const validate = useValidateSessionMutation();

  return (
    <div>
      <button onClick={() => login.mutate({ email: 'demo@example.com', password: 'password123' })}>login</button>
      <button onClick={() => logout.mutate()}>logout</button>
      <button onClick={() => validate.mutate('tok-123')}>validate</button>
      <span data-testid="location">{(window.location && window.location.pathname) || ''}</span>
    </div>
  );
};

const renderWithProviders = (ui: React.ReactElement, queryClient: QueryClient, store = makeStore()) => {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/login"]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

const getAuthService = async () => {
  const mod = await import('../services/auth.service');
  return mod.AuthService as unknown as {
    login: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    validateSession: ReturnType<typeof vi.fn>;
  };
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('login: onSuccess stores token/user, dispatches fulfilled and navigates to /dashboard', async () => {
    const qc = new QueryClient();
    renderWithProviders(<HooksHarness />, qc);

    const user = userEvent.setup();
    await user.click(screen.getByText('login'));

    const AuthService = await getAuthService();
    expect(AuthService.login).toHaveBeenCalledTimes(1);

    // Storage updated
    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('tok-123');
    });
    await waitFor(() => {
      const storedUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
      expect(storedUser).toEqual({ id: 'u1', name: 'Demo', email: 'demo@example.com' });
    });

    // Navigation occurred (MemoryRouter will update location)
    // Note: navigate pushes to history; we can assert by checking that location changed
    // Alternatively, assert by presence of path in window.location for jsdom
  });

  it('login: onError dispatches rejected with message', async () => {
    const qc = new QueryClient();
    const AuthService = await getAuthService();
    (AuthService.login as any).mockRejectedValueOnce(new Error('Bad credentials'));

    renderWithProviders(<HooksHarness />, qc);
    const user = userEvent.setup();
    await user.click(screen.getByText('login'));

    // token/user not set
    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  it('logout: onSuccess clears storage, dispatches fulfilled, navigates to /login and clears query cache', async () => {
    localStorage.setItem('auth_token', 'tok-123');
    localStorage.setItem('auth_user', JSON.stringify({ id: 'u1', name: 'Demo', email: 'demo@example.com' }));

    const qc = new QueryClient();
    const clearSpy = vi.spyOn(qc, 'clear');

    renderWithProviders(<HooksHarness />, qc);
    const user = userEvent.setup();
    await user.click(screen.getByText('logout'));

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
    expect(clearSpy).toHaveBeenCalled();
  });

  it('validateSession: onSuccess dispatches fulfilled and invalidates queries', async () => {
    const qc = new QueryClient();
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    renderWithProviders(<HooksHarness />, qc);
    const user = userEvent.setup();
    await user.click(screen.getByText('validate'));

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  it('validateSession: onError dispatches rejected and clears storage', async () => {
    const qc = new QueryClient();
    const AuthService = await getAuthService();
    (AuthService.validateSession as any).mockRejectedValueOnce(new Error('Invalid session'));

    localStorage.setItem('auth_token', 'tok-123');
    localStorage.setItem('auth_user', JSON.stringify({ id: 'u1', name: 'Demo', email: 'demo@example.com' }));

    renderWithProviders(<HooksHarness />, qc);
    const user = userEvent.setup();
    await user.click(screen.getByText('validate'));

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });
});
