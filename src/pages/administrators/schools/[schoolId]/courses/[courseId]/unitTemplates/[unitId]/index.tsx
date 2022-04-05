import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUnitTemplateEdit } from '@/components/administrators/NewUnitTemplateEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
  unitId: string | null;
};

const NewUnitTemplateEditPage: NextPage<Props> = ({ schoolId, courseId, unitId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null || !unitId) {
    return <Error statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit Template View" />
      <NewUnitTemplateEdit
        administratorId={authState.administratorId}
        schoolId={schoolId}
        courseId={courseId}
        unitId={unitId}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { schoolId, courseId, unitId } };
};

export default NewUnitTemplateEditPage;
