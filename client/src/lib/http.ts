export const BASE_URL = '/api/v1';

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
