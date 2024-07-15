import type { FC, ReactEventHandler, SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';

import { Video } from '@/components/Video';

type OnPlayFunction = (e: SyntheticEvent<HTMLVideoElement, Event>, videoId: string) => void;

type Props = {
  videoId: string;
  src: string;
  posterSrc?: string;
  captionSrc: string | null;
  playingVideoId?: string;
  onPlay: OnPlayFunction;
};

export const CourseVideo: FC<Props> = ({ videoId, src, posterSrc, captionSrc, playingVideoId, onPlay }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // if some other video has been set as the currently playing video, then stop this one
  useEffect(() => {
    if (playingVideoId !== videoId) {
      videoRef.current?.pause();
    }
  }, [ videoId, playingVideoId ]);

  const handlePlay: ReactEventHandler<HTMLVideoElement> = e => {
    onPlay(e, videoId);
  };

  return (
    <Video controls ref={videoRef} src={src} preload="none" poster={posterSrc} captionSrc={captionSrc ?? undefined} style={{ width: '100%' }} onPlay={handlePlay} />
  );
};
