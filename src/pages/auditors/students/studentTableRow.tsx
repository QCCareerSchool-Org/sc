import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';
import { Fragment } from 'react';

import { EnrollmentsCell } from './enrollmentsCell';
import type { StudentData } from './state';

type Props = {
  student: StudentData;
};

export const StudentTableRow: FC<Props> = ({ student }) => {
  const router = useRouter();

  const handleClick: MouseEventHandler = e => {
    e.preventDefault();
    void router.push(`/auditors/students/${student.studentId}`);
  };

  return (
    <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
      <td>{student.firstName} {student.lastName}</td>
      <td>{student.province ? `${student.province.name}, ${student.country.code}` : student.country.code}</td>
      <td>{student.groups.map(g => <Fragment key={g}><span className="badge text-bg-secondary">{g}</span>{' '}</Fragment>)}</td>
      <EnrollmentsCell enrollments={student.enrollments} />
    </tr>
  );
};
