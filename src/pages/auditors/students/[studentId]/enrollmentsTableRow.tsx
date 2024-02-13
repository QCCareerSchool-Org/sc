import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';

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
      <td>{enrollment.enrollmentDate ? formatDate(enrollment.enrollmentDate) : 'n/a'}</td>
      <td>4 / 6</td>
    </tr>
  );
};
