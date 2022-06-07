import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewUploadSlotTemplateEdit } from '@/components/administrators/NewUploadSlotTemplateEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  uploadSlotId: string | null;
};

const NewTextBoxTemplateEditPage: NextPage<Props> = ({ uploadSlotId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!uploadSlotId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Upload Slot Template" />
      <NewUploadSlotTemplateEdit administratorId={authState.administratorId} uploadSlotId={uploadSlotId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const uploadSlotIdParam = ctx.params?.uploadSlotId;
  const uploadSlotId = typeof uploadSlotIdParam === 'string' ? uploadSlotIdParam : null;
  return { props: { uploadSlotId } };
};

export default NewTextBoxTemplateEditPage;
