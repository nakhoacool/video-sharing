import type { Video } from '../../types';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
}

function getEmbedUrl(url: string): string {
  const watchMatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

export default function VideoCard({ video }: VideoCardProps) {
  const embedUrl = getEmbedUrl(video.link);
  const sharedBy = video.shared_by.email;

  return (
    <div className="video-card">
      <div className="video-player">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-meta">
          <span className="meta-label">Shared by:</span> {sharedBy}
        </p>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
      </div>
    </div>
  );
}
