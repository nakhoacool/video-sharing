import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../../components/AuthModal';

const mockLogin = vi.hoisted(() => vi.fn());
const mockRegister = vi.hoisted(() => vi.fn());

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    user: null,
    token: null,
    logout: vi.fn(),
  }),
}));

describe('AuthModal — login mode', () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it('renders email and password fields', () => {
    render(<AuthModal mode="login" onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('does not render Name or Confirm Password fields', () => {
    render(<AuthModal mode="login" onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
  });

  it('calls login with credentials and invokes onSuccess', async () => {
    mockLogin.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    render(<AuthModal mode="login" onClose={vi.fn()} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'secret');
  });

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    render(<AuthModal mode="login" onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials'),
    );
  });

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn();
    render(<AuthModal mode="login" onClose={onClose} onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('AuthModal — register mode', () => {
  beforeEach(() => {
    mockRegister.mockReset();
  });

  it('renders Name and Confirm Password fields', () => {
    render(<AuthModal mode="register" onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('calls register with all fields and invokes onSuccess', async () => {
    mockRegister.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    render(<AuthModal mode="register" onClose={vi.fn()} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(mockRegister).toHaveBeenCalledWith('Alice', 'a@b.com', 'pass', 'pass');
  });

  it('shows error message on register failure', async () => {
    mockRegister.mockRejectedValue(new Error('Email already taken'));
    render(<AuthModal mode="register" onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'taken@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Email already taken'),
    );
  });
});
