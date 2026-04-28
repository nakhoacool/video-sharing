import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VideoCard from '../../components/VideoCard';
import type { Video } from '../../types';

const baseVideo: Video = {
  id: 1,
  title: 'My Movie',
  description: 'A great film',
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  created_at: '2026-01-01',
  shared_by: { id: 2, name: 'Bob', email: 'bob@example.com' },
};

describe('VideoCard', () => {
  it('renders title', () => {
    render(<VideoCard video={baseVideo} />);
    expect(screen.getByText('My Movie')).toBeInTheDocument();
  });

  it('renders shared_by email', () => {
    render(<VideoCard video={baseVideo} />);
    expect(screen.getByText(/bob@example\.com/)).toBeInTheDocument();
  });

  it('renders description when present', () => {
    render(<VideoCard video={baseVideo} />);
    expect(screen.getByText('A great film')).toBeInTheDocument();
  });

  it('hides description when null', () => {
    render(<VideoCard video={{ ...baseVideo, description: null }} />);
    expect(screen.queryByText('A great film')).not.toBeInTheDocument();
  });

  it('converts youtube watch URL to embed URL', () => {
    render(<VideoCard video={baseVideo} />);
    const iframe = screen.getByTitle('My Movie');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('converts youtu.be short URL to embed URL', () => {
    render(<VideoCard video={{ ...baseVideo, link: 'https://youtu.be/abc123' }} />);
    const iframe = screen.getByTitle('My Movie');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123');
  });

  it('passes non-youtube URLs through as-is', () => {
    render(<VideoCard video={{ ...baseVideo, link: 'https://vimeo.com/12345' }} />);
    const iframe = screen.getByTitle('My Movie');
    expect(iframe).toHaveAttribute('src', 'https://vimeo.com/12345');
  });
});
