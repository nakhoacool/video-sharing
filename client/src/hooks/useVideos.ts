import { useState, useCallback } from 'react';
import { getVideos } from '../api/videos';
import type { Video } from '../types';

interface UseVideosResult {
  videos: Video[];
  loading: boolean;
  error: string;
  fetchVideos: () => void;
}

export function useVideos(): UseVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVideos = useCallback(() => {
    getVideos()
      .then(setVideos)
      .catch(() => setError('Failed to load videos'))
      .finally(() => setLoading(false));
  }, []);

  return { videos, loading, error, fetchVideos };
}
