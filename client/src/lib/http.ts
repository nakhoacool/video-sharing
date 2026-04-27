const API_ORIGIN = import.meta.env.VITE_API_BASE_URL ?? '';

export const BASE_URL = `${API_ORIGIN}/api/v1`;

export const CABLE_URL = (token: string) =>
  `${API_ORIGIN.replace(/^https/, 'wss').replace(/^http/, 'ws')}/cable?token=${token}`;

export function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export function parseError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'errors' in data) {
    const { errors } = data as { errors: unknown };
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'string') return errors;
  }
  return fallback;
}
