import type { GetServerSideProps } from 'next';
import { useEffect, useRef, useState } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { BlankLayout } from '@/components/layouts/BlankLayout';
import { Video as VideoComponent } from '@/components/Video';
import type { Video } from '@/domain/video';
import { useAuthState } from '@/hooks/useAuthState';
import { useStudentServices } from '@/hooks/useStudentServices';
import type { NextPageWithLayout } from 'src/pages/_app';

type Props = {
  videoId: string | null;
};

const VideoPage: NextPageWithLayout<Props> = ({ videoId }) => {
  const [ video, setVideo ] = useState<Video>();
  const { studentId } = useAuthState();
  const { videoService } = useStudentServices();

  const request$ = useRef(new Subject<{ studentId: number; videoId: string }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    request$.current.pipe(
      switchMap(({ studentId: s, videoId: v }) => {
        return videoService.getVideo(s, v);
      }),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe(setVideo);

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ videoService ]);

  useEffect(() => {
    if (videoId && typeof studentId !== 'undefined') {
      request$.current.next({ studentId, videoId });
    }
  }, [ studentId, videoId ]);

  if (!video) {
    return null;
  }

  return (
    <VideoComponent controls src={video.src} poster={video.posterSrc} captionSrc={video.captionSrc ?? undefined} />
  );
};

VideoPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  ctx.res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  const videoIdParam = ctx.params?.videoId;
  const videoId = typeof videoIdParam === 'string' ? videoIdParam : null;
  return { props: { videoId } };
};

export default VideoPage;
