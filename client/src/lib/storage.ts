import type { User } from '../types';

export function getStoredUser(): User | null {
  const stored = localStorage.getItem('user');
  return stored ? (JSON.parse(stored) as User) : null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuth(user: User, token: string): void {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function clearAuth(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}
