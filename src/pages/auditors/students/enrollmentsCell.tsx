import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';
import { Fragment } from 'react';

import { Badge } from './badge';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';

type Props = {
  enrollments: Array<Enrollment & { course: Course }>;
};

const maxCourses = 4;

export const EnrollmentsCell: FC<Props> = ({ enrollments }) => {
  const router = useRouter();

  return (
    <td>
      {enrollments.filter((_, i) => i < maxCourses).map(enrollment => {
        const handleClick: MouseEventHandler = e => {
          e.preventDefault();
          e.stopPropagation();
          void router.push(`/auditors/students/${enrollment.studentId}/courses/${enrollment.courseId}`);
        };

        return (
          <Fragment key={enrollment.enrollmentId}>
            <Badge onClick={handleClick} title={enrollment.course.name}>{enrollment.course.code}</Badge>
            {' '}
          </Fragment>
        );
      })}
      {enrollments.length > maxCourses && <>&hellip;</>}
    </td>
  );
};
