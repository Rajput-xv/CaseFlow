import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser, clearError } from '@/features/auth/authSlice';

interface RootState {
  auth: {
    user: any;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('has initial state with no user and not authenticated', () => {
    const state = (store.getState() as RootState).auth;
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets user with setUser action', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN' as const,
    };

    store.dispatch(setUser(user));

    const state = (store.getState() as RootState).auth;
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears user with setUser(null)', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN' as const,
    };

    store.dispatch(setUser(user));
    expect((store.getState() as RootState).auth.isAuthenticated).toBe(true);

    store.dispatch(setUser(null));

    const state = (store.getState() as RootState).auth;
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('clears error with clearError action', () => {
    // Manually set error by dispatching a failed action
    const stateWithError = {
      ...authReducer(undefined, { type: '' }),
      error: 'Some error',
    };

    const newState = authReducer(stateWithError, clearError());
    expect(newState.error).toBeNull();
  });

  it('maintains state immutability', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN' as const,
    };

    const stateBefore = (store.getState() as RootState).auth;
    store.dispatch(setUser(user));
    const stateAfter = (store.getState() as RootState).auth;

    expect(stateBefore).not.toBe(stateAfter);
    expect(stateBefore.user).not.toBe(stateAfter.user);
  });
});
