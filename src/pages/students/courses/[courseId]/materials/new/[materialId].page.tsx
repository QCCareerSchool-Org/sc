import type { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';

import { MaterialView } from './materialView';
import { LessonLayout } from '@/components/layouts/LessonLayout';
import { useAuthState } from '@/hooks/useAuthState';
import type { NextPageWithLayout } from 'src/pages/_app.page';

type Props = {
  courseId: number | null;
  materialId: string | null;
};

const MaterialPage: NextPageWithLayout<Props> = ({ courseId, materialId }) => {
  const { studentId } = useAuthState();

  if (typeof studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || materialId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return <MaterialView studentId={studentId} courseId={courseId} materialId={materialId} />;
};

MaterialPage.getLayout = page => <LessonLayout>{page}</LessonLayout>;

export default MaterialPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const materialIdParam = ctx.params?.materialId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { courseId, materialId } };
};
