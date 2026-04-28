import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/Header';
import type { User } from '../../types';

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock('../../contexts/AuthContext', () => ({ useAuth: mockUseAuth }));

const mockUser: User = { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '' };

function renderHeader(props: { onLogin?: () => void; onRegister?: () => void } = {}) {
  return render(
    <MemoryRouter>
      <Header onLogin={props.onLogin ?? vi.fn()} onRegister={props.onRegister ?? vi.fn()} />
    </MemoryRouter>,
  );
}

describe('Header — unauthenticated', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, token: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() });
  });

  it('shows Login and Register buttons', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('does not show logout or welcome', () => {
    renderHeader();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });

  it('calls onLogin when Login clicked', () => {
    const onLogin = vi.fn();
    renderHeader({ onLogin });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('calls onRegister when Register clicked', () => {
    const onRegister = vi.fn();
    renderHeader({ onRegister });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});

describe('Header — authenticated', () => {
  const logout = vi.fn();

  beforeEach(() => {
    logout.mockReset();
    mockUseAuth.mockReturnValue({ user: mockUser, token: 'tok', login: vi.fn(), register: vi.fn(), logout });
  });

  it('shows welcome message with user email', () => {
    renderHeader();
    expect(screen.getByText(/alice@example\.com/)).toBeInTheDocument();
  });

  it('shows Share and Logout buttons', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Share a movie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('hides Login and Register buttons', () => {
    renderHeader();
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
  });

  it('calls logout when Logout clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
