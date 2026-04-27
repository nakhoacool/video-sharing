import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shareVideo } from '../../api/videos';
import Header from '../../components/Header';
import AuthModal from '../../components/AuthModal';
import './SharePage.css';

export default function SharePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState<'login' | 'register' | null>(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      await shareVideo(token, title, link, description);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to share video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share-page">
      <Header
        onLogin={() => setModalMode('login')}
        onRegister={() => setModalMode('register')}
      />
      <main className="share-main">
        <div className="share-card">
          <h1 className="share-title">Share a Movie</h1>

          {!user ? (
            <p className="share-auth-notice">
              You must be logged in to share a movie.{' '}
              <button className="link-btn" onClick={() => setModalMode('login')}>
                Login
              </button>
            </p>
          ) : (
            <>
              {error && <div className="share-error" role="alert">{error}</div>}
              <form onSubmit={handleSubmit} className="share-form">
                <div className="form-group">
                  <label htmlFor="share-title">Title</label>
                  <input
                    id="share-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="Movie title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="share-link">YouTube URL</label>
                  <input
                    id="share-link"
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="share-description">Description</label>
                  <textarea
                    id="share-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tell us about this movie…"
                    rows={5}
                  />
                </div>
                <div className="share-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sharing…' : 'Share'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSuccess={() => setModalMode(null)}
        />
      )}
    </div>
  );
}
