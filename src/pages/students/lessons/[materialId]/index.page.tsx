import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useRef } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { endpoint } from 'src/basePath';

type Props = {
  materialId: string | null;
};

const LessonPage: NextPage<Props> = ({ materialId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handle = (): void => {
      if (iframeRef.current) {
        iframeRef.current.width = `${window.document.body.clientWidth}px`;
        iframeRef.current.height = `${Math.max(800, window.document.body.clientHeight - 60, iframeRef.current.contentDocument?.body.clientHeight ?? 0)}px`;
      }
    };
    window.addEventListener('resize', handle);
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handle);
    }
    handle();
    return () => {
      window.removeEventListener('resize', handle);
      if (iframe) {
        iframe.removeEventListener('load', handle);
      }
    };
  }, []);

  const { studentId } = useAuthState();

  const src = `${endpoint}/students/${studentId}/static/lessons/${materialId}/content`;

  return (
    <>
      {/* <Section className="bg-dark text-white py-2">
        <div className="container text-center">
          <button className="btn btn-primary btn-lg">Back</button>
        </div>
      </Section> */}
      <iframe ref={iframeRef} src={src} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const materialIdParam = ctx.params?.materialId;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { materialId } };
};

export default LessonPage;
