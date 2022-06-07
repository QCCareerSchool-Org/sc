import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { UnitPriceEdit } from '@/components/administrators/UnitPriceEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  countryId: number | null;
};

const UnitPriceEditPage: NextPage<Props> = ({ courseId, countryId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (courseId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Unit Price" />
      <UnitPriceEdit administratorId={authState.administratorId} courseId={courseId} countryId={countryId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.query?.courseId;
  const countryIdParam = ctx.query?.countryId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const countryId = typeof countryIdParam === 'string' && countryIdParam.length ? parseInt(countryIdParam, 10) : null;
  return { props: { courseId, countryId } };
};

export default UnitPriceEditPage;
