import { describe, it, expect } from 'vitest';
import { authHeaders, parseError, BASE_URL } from '../../lib/http';

describe('authHeaders', () => {
  it('returns only Content-Type when no token given', () => {
    expect(authHeaders()).toEqual({ 'Content-Type': 'application/json' });
  });

  it('includes Authorization Bearer when token provided', () => {
    expect(authHeaders('my-token')).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer my-token',
    });
  });

  it('skips Authorization when token is null', () => {
    const headers = authHeaders(null) as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('skips Authorization when token is undefined', () => {
    const headers = authHeaders(undefined) as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });
});

describe('parseError', () => {
  it('joins array errors with comma', () => {
    expect(parseError({ errors: ['err1', 'err2'] }, 'fallback')).toBe('err1, err2');
  });

  it('returns string errors directly', () => {
    expect(parseError({ errors: 'single error' }, 'fallback')).toBe('single error');
  });

  it('returns fallback when errors key missing', () => {
    expect(parseError({}, 'fallback')).toBe('fallback');
  });

  it('returns fallback for null input', () => {
    expect(parseError(null, 'fallback')).toBe('fallback');
  });

  it('returns fallback for non-object input', () => {
    expect(parseError('some string', 'fallback')).toBe('fallback');
  });
});

describe('BASE_URL', () => {
  it('ends with /api/v1', () => {
    expect(BASE_URL).toMatch(/\/api\/v1$/);
  });
});
