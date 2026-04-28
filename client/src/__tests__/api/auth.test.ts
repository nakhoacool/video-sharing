import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register } from '../../api/auth';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('login', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns AuthResponse on success', async () => {
    const payload = {
      user: { id: 1, name: 'Alice', email: 'a@b.com', created_at: '' },
      token: 'tok',
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => payload });

    await expect(login('a@b.com', 'pass')).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws with parsed array error on failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Invalid credentials'] }),
    });
    await expect(login('a@b.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('throws with fallback message when no errors field', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) });
    await expect(login('a@b.com', 'pass')).rejects.toThrow('Login failed');
  });
});

describe('register', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns AuthResponse on success', async () => {
    const payload = {
      user: { id: 2, name: 'Bob', email: 'b@b.com', created_at: '' },
      token: 'tok2',
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => payload });

    await expect(register('Bob', 'b@b.com', 'pass', 'pass')).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws with parsed error on failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Email already taken'] }),
    });
    await expect(register('Bob', 'b@b.com', 'pass', 'pass')).rejects.toThrow('Email already taken');
  });

  it('throws with fallback message when no errors field', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) });
    await expect(register('Bob', 'b@b.com', 'pass', 'pass')).rejects.toThrow('Registration failed');
  });
});
