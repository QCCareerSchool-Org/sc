import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { MaterialView } from './materialView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  materialId: string | null;
};

const LessonPage: NextPage<Props> = ({ materialId }) => {
  const { studentId } = useAuthState();

  if (typeof studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (materialId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return <MaterialView studentId={studentId} materialId={materialId} />;
};

export default LessonPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const materialIdParam = ctx.params?.materialId;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { materialId } };
};
