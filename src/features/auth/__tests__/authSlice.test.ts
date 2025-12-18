import { describe, it, expect, beforeEach, vi } from 'vitest';

// Helper to (re)import slice after changing localStorage
const importSlice = async () => {
  vi.resetModules();
  const mod = await import('../store/authSlice');
  return mod;
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('initial state: unauthenticated when no localStorage data', async () => {
    const { default: reducer } = await importSlice();
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });

  it('initial state: authenticated when token and user exist', async () => {
    const user = { id: 'u1', name: 'Demo', email: 'demo@example.com' };
    localStorage.setItem('auth_token', 'token-123');
    localStorage.setItem('auth_user', JSON.stringify(user));

    const { default: reducer } = await importSlice();
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe('token-123');
  });

  it('clearError resets error to null', async () => {
    const { default: reducer, loginRejected, clearError } = await importSlice();
    let state = reducer(undefined, { type: '@@INIT' });
    state = reducer(state, loginRejected('Invalid credentials'));
    expect(state.error).toBe('Invalid credentials');
    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });

  it('loginFulfilled sets auth data and clears error', async () => {
    const { default: reducer, loginFulfilled } = await importSlice();
    const payload = { user: { id: 'u2', name: 'User', email: 'u2@example.com' }, token: 't-456' };
    const state = reducer(undefined, loginFulfilled(payload));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('t-456');
    expect(state.error).toBeNull();
  });

  it('loginRejected clears auth data and sets error', async () => {
    const { default: reducer, loginRejected } = await importSlice();
    const state = reducer(undefined, loginRejected('Oops'));
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBe('Oops');
  });

  it('logoutFulfilled clears auth data', async () => {
    const { default: reducer, loginFulfilled, logoutFulfilled } = await importSlice();
    const loggedIn = reducer(undefined, loginFulfilled({ user: { id: 'u3', name: 'X', email: 'x@x.com' }, token: 'tok' }));
    const state = reducer(loggedIn, logoutFulfilled());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });

  it('validateSessionFulfilled sets auth data', async () => {
    const { default: reducer, validateSessionFulfilled } = await importSlice();
    const payload = { user: { id: 'u4', name: 'Y', email: 'y@y.com' }, token: 'tok2' };
    const state = reducer(undefined, validateSessionFulfilled(payload));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('tok2');
  });

  it('validateSessionRejected clears auth data', async () => {
    const { default: reducer, validateSessionRejected } = await importSlice();
    const state = reducer(undefined, validateSessionRejected());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
