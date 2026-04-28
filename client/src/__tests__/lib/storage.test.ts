import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredUser, getStoredToken, setAuth, clearAuth } from '../../lib/storage';
import type { User } from '../../types';

const mockUser: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStoredUser', () => {
    it('returns null when nothing stored', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('returns parsed user when stored', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      expect(getStoredUser()).toEqual(mockUser);
    });
  });

  describe('getStoredToken', () => {
    it('returns null when nothing stored', () => {
      expect(getStoredToken()).toBeNull();
    });

    it('returns token string when stored', () => {
      localStorage.setItem('token', 'abc123');
      expect(getStoredToken()).toBe('abc123');
    });
  });

  describe('setAuth', () => {
    it('persists user and token in localStorage', () => {
      setAuth(mockUser, 'tok');
      expect(localStorage.getItem('token')).toBe('tok');
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
    });
  });

  describe('clearAuth', () => {
    it('removes user and token from localStorage', () => {
      setAuth(mockUser, 'tok');
      clearAuth();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
