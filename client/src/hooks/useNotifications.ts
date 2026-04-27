import { useEffect, useRef } from 'react';
import { createConsumer, Consumer } from '@rails/actioncable';
import { toast } from 'react-toastify';
import type { User } from '../types';
import { CABLE_URL } from '../lib/http';

interface NewVideoPayload {
  type: 'new_video_shared';
  video: { title: string; link: string };
  shared_by: { email: string };
}

export function useNotifications(
  token: string | null,
  currentUser: User | null,
  onNewVideo?: () => void,
) {
  // Stable ref so the effect doesn't re-run when the callback changes identity
  const onNewVideoRef = useRef(onNewVideo);
  onNewVideoRef.current = onNewVideo;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  useEffect(() => {
    if (!token) return;

    const consumer: Consumer = createConsumer(CABLE_URL(token));

    consumer.subscriptions.create('NotificationsChannel', {
      received(data: NewVideoPayload) {
        if (data.type === 'new_video_shared') {
          // Skip notification for the user who shared the video
          if (currentUserRef.current?.email === data.shared_by.email) return;

          const toastId = `${data.shared_by.email}:${data.video.title}`;
          toast.info(
            `🎬 "${data.video.title}" was just shared by ${data.shared_by.email}`,
            { autoClose: 5000, toastId },
          );
          onNewVideoRef.current?.();
        }
      },
    });

    return () => {
      consumer.disconnect();
    };
  }, [token]);
}
