import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Header({ onLogin, onRegister }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-logo" onClick={() => navigate('/')}>Funny Movies</div>
      <div className="header-actions">
        {user ? (
          <>
            <span className="header-welcome">Welcome {user.email}</span>
            <button className="btn btn-primary" onClick={() => navigate('/share')}>
              Share a movie
            </button>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={onLogin}>Login</button>
            <button className="btn btn-primary" onClick={onRegister}>Register</button>
          </>
        )}
      </div>
    </header>
  );
}
