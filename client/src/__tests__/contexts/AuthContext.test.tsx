import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { login as apiLogin, register as apiRegister } from '../../api/auth';

vi.mock('../../api/auth', () => ({ login: vi.fn(), register: vi.fn() }));

const mockApiLogin = vi.mocked(apiLogin);
const mockApiRegister = vi.mocked(apiRegister);

const authResponse = {
  user: { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '' },
  token: 'tok123',
};

type AuthCtx = ReturnType<typeof useAuth>;

function TestConsumer({ spy }: { spy: (ctx: AuthCtx) => void }) {
  spy(useAuth());
  return null;
}

function setup() {
  const spy = vi.fn((ctx: AuthCtx) => { void ctx; });
  render(
    <AuthProvider>
      <TestConsumer spy={spy} />
    </AuthProvider>,
  );
  return spy;
}

function lastCall(spy: ReturnType<typeof setup>) {
  return spy.mock.calls[spy.mock.calls.length - 1][0];
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides null user and token initially', () => {
    const spy = setup();
    expect(lastCall(spy).user).toBeNull();
    expect(lastCall(spy).token).toBeNull();
  });

  it('login sets user, token and persists to localStorage', async () => {
    mockApiLogin.mockResolvedValue(authResponse);
    const spy = setup();

    await act(async () => {
      await lastCall(spy).login('alice@example.com', 'pass');
    });

    expect(lastCall(spy).user).toEqual(authResponse.user);
    expect(lastCall(spy).token).toBe('tok123');
    expect(localStorage.getItem('token')).toBe('tok123');
  });

  it('register sets user, token and persists to localStorage', async () => {
    mockApiRegister.mockResolvedValue(authResponse);
    const spy = setup();

    await act(async () => {
      await lastCall(spy).register('Alice', 'alice@example.com', 'pass', 'pass');
    });

    expect(lastCall(spy).user).toEqual(authResponse.user);
    expect(lastCall(spy).token).toBe('tok123');
    expect(localStorage.getItem('token')).toBe('tok123');
    expect(mockApiRegister).toHaveBeenCalledWith('Alice', 'alice@example.com', 'pass', 'pass');
  });

  it('logout clears user, token and localStorage', async () => {
    mockApiLogin.mockResolvedValue(authResponse);
    const spy = setup();

    await act(async () => {
      await lastCall(spy).login('alice@example.com', 'pass');
    });

    act(() => {
      lastCall(spy).logout();
    });

    expect(lastCall(spy).user).toBeNull();
    expect(lastCall(spy).token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('token', 'stored-tok');
    localStorage.setItem('user', JSON.stringify(authResponse.user));

    const spy = setup();
    expect(lastCall(spy).user).toEqual(authResponse.user);
    expect(lastCall(spy).token).toBe('stored-tok');
  });

  it('throws when useAuth called outside AuthProvider', () => {
    function Bad() {
      useAuth();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useAuth must be used within AuthProvider');
  });
});
