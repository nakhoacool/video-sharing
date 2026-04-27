import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import AuthModal from '../../components/AuthModal';
import VideoCard from '../../components/VideoCard';
import { useAuth } from '../../contexts/AuthContext';
import { useVideos } from '../../hooks/useVideos';
import { useNotifications } from '../../hooks/useNotifications';
import './HomePage.css';

export default function HomePage() {
  const { token, user } = useAuth();
  const [modalMode, setModalMode] = useState<'login' | 'register' | null>(null);
  const { videos, loading, error, fetchVideos } = useVideos();

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  useNotifications(token, user, fetchVideos);

  return (
    <div className="home-page">
      <Header
        onLogin={() => setModalMode('login')}
        onRegister={() => setModalMode('register')}
      />
      <main className="home-main">
        {loading && <p className="feed-status">Loading videos…</p>}
        {error && <p className="feed-status feed-error">{error}</p>}
        {!loading && !error && videos.length === 0 && (
          <p className="feed-status">No videos shared yet. Be the first!</p>
        )}
        <div className="video-feed">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
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
