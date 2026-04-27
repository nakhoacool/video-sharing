import type { Video } from '../types';
import { BASE_URL, authHeaders, parseError } from '../lib/http';

export async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${BASE_URL}/videos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function shareVideo(
  token: string,
  title: string,
  link: string,
  description: string,
): Promise<Video> {
  const res = await fetch(`${BASE_URL}/videos`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ title, link, description }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(parseError(data, 'Failed to share video'));
  }
  return res.json();
}
