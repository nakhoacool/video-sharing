import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVideos } from '../../hooks/useVideos';
import { getVideos } from '../../api/videos';
import type { Video } from '../../types';

vi.mock('../../api/videos', () => ({ getVideos: vi.fn() }));

const mockGetVideos = vi.mocked(getVideos);

const mockVideo: Video = {
  id: 1,
  title: 'Test Video',
  description: null,
  link: 'https://youtu.be/abc',
  created_at: '',
  shared_by: { id: 1, name: 'Alice', email: 'alice@example.com' },
};

describe('useVideos', () => {
  beforeEach(() => {
    mockGetVideos.mockReset();
  });

  it('starts with loading true, empty videos and no error', () => {
    mockGetVideos.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useVideos());
    expect(result.current.loading).toBe(true);
    expect(result.current.videos).toEqual([]);
    expect(result.current.error).toBe('');
  });

  it('sets videos and stops loading on successful fetch', async () => {
    mockGetVideos.mockResolvedValue([mockVideo]);
    const { result } = renderHook(() => useVideos());

    result.current.fetchVideos();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.videos).toEqual([mockVideo]);
    expect(result.current.error).toBe('');
  });

  it('sets error and stops loading on failed fetch', async () => {
    mockGetVideos.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useVideos());

    result.current.fetchVideos();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to load videos');
    expect(result.current.videos).toEqual([]);
  });

  it('exposes stable fetchVideos callback reference', () => {
    mockGetVideos.mockResolvedValue([]);
    const { result, rerender } = renderHook(() => useVideos());
    const first = result.current.fetchVideos;
    rerender();
    expect(result.current.fetchVideos).toBe(first);
  });
});
