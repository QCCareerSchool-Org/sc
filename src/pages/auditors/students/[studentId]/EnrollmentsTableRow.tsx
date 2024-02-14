import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';

import { CourseProgress } from './CourseProgress';
import type { StudentData } from './state';
import { formatDate } from 'src/formatDate';

type Props = {
  enrollment: StudentData['enrollments'][0];
};

export const EnrollmentsTableRow: FC<Props> = ({ enrollment }) => {
  const router = useRouter();

  const handleClick: MouseEventHandler = e => {
    e.preventDefault();
    void router.push(`/auditors/students/${enrollment.studentId}/courses/${enrollment.courseId}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{enrollment.course.name}</td>
      <td>{enrollment.enrollmentDate ? formatDate(enrollment.enrollmentDate) : 'N/A'}</td>
      <td>{enrollment.tutor ? `${enrollment.tutor.firstName} ${enrollment.tutor.lastName}` : 'N/A'}</td>
      <td><CourseProgress enrollment={enrollment} /></td>
    </tr>
  );
};
