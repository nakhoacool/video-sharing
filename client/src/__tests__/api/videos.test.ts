import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getVideos, shareVideo } from '../../api/videos';
import type { Video } from '../../types';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockVideo: Video = {
  id: 1,
  title: 'Test Video',
  description: 'A description',
  link: 'https://youtu.be/abc123',
  created_at: '2026-01-01',
  shared_by: { id: 1, name: 'Alice', email: 'alice@example.com' },
};

describe('getVideos', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns video array on success', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [mockVideo] });
    await expect(getVideos()).resolves.toEqual([mockVideo]);
  });

  it('sends request to /videos endpoint', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getVideos();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/videos'),
      expect.any(Object),
    );
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(getVideos()).rejects.toThrow('Failed to fetch videos');
  });
});

describe('shareVideo', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns created video on success', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockVideo });
    await expect(shareVideo('tok', 'Test Video', 'https://youtu.be/abc123', 'A description')).resolves.toEqual(mockVideo);
  });

  it('sends POST to /videos with auth header', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockVideo });
    await shareVideo('my-token', 'Title', 'https://youtu.be/x', 'Desc');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/videos'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer my-token' }),
      }),
    );
  });

  it('throws with parsed error array on failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Title is required'] }),
    });
    await expect(shareVideo('tok', '', '', '')).rejects.toThrow('Title is required');
  });

  it('throws with fallback message when no errors field', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) });
    await expect(shareVideo('tok', '', '', '')).rejects.toThrow('Failed to share video');
  });
});
