import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewAssignmentTemplatePreview } from '@/components/administrators/NewAssignmentTemplatePreview';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  assignmentId: string | null;
};

const NewAssignmentTemplatePreviewPage: NextPage<Props> = ({ assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!assignmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Assignment Preview" />
      <NewAssignmentTemplatePreview administratorId={authState.administratorId} assignmentId={assignmentId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const assignmentIdParam = ctx.params?.assignmentId;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { assignmentId } };
};

export default NewAssignmentTemplatePreviewPage;
