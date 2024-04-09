import type { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';

import type { ReactElement } from 'react';
import { useEffect, useMemo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import type { NextPageWithLayout } from 'src/pages/_app.page';

type Props = {
  courseId: number | null;
  materialId: string | null;
};

const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const LessonPage: NextPageWithLayout<Props> = ({ courseId, materialId }) => {
  const { studentId } = useAuthState();

  const content = useMemo(() => {
    const size = randomInt(4, 8);
    return new Array(size).fill(undefined).map((_, i) => <p key={i}>Lorem ipsum</p>) as JSX.Element[];
  }, []);

  useEffect(() => {
    const handler = (): void => {
      //
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (typeof studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || materialId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return <div className="py-5">{content}</div>;
};

LessonPage.getLayout = (page: ReactElement) => <>{page}</>;

export default LessonPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const materialIdParam = ctx.params?.materialId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { courseId, materialId } };
};
