import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginPage } from '../LoginPage';

// Mock translate to avoid Redux/provider wiring
vi.mock('../../../shared/i18n/useTranslate', () => ({
  useTranslate: () => (key: string) => {
    const map: Record<string, string> = {
      'auth.title': 'Sign in',
      'auth.subtitle': 'Access your account',
      'auth.email': 'Email',
      'auth.emailPlaceholder': 'email@example.com',
      'auth.password': 'Password',
      'auth.signIn': 'Sign In',
      'auth.signingIn': 'Signing In',
      'auth.demoAccess': 'Demo Access',
      'auth.demoCredentials': 'Demo Credentials',
      'auth.demoEmail': 'Email',
      'auth.demoPassword': 'Password',
    };
    return map[key] ?? key;
  },
}));

// Mock useLoginMutation to control mutation behavior
const mutateSpy = vi.fn();
let mockIsPending = false;
vi.mock('../hooks/useAuth', () => ({
  useLoginMutation: () => ({
    mutate: mutateSpy,
    isPending: mockIsPending,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mutateSpy.mockClear();
    mockIsPending = false;
  });

  it('renders email, password fields and submit button', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.type(emailInput, 'not-an-email');
    await user.type(passwordInput, '123');

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 6/i)).toBeInTheDocument();
  });

  it('calls mutate with credentials on valid submit', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.type(emailInput, 'demo@example.com');
    await user.type(passwordInput, 'password123');

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'password123',
    });
  });

  it('disables submit and shows signing state when pending', () => {
    mockIsPending = true;
    render(<LoginPage />);

    const button = screen.getByRole('button', { name: /Signing In/i });
    expect(button).toBeDisabled();
  });
});
