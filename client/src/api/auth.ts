import type { AuthResponse } from '../types';
import { BASE_URL, authHeaders, parseError } from '../lib/http';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(parseError(data, 'Login failed'));
  }
  return res.json();
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(parseError(data, 'Registration failed'));
  }
  return res.json();
}
