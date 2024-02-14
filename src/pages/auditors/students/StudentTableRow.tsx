import { useRouter } from 'next/router';
import type { FC, MouseEvent, MouseEventHandler } from 'react';
import { Fragment } from 'react';

import { Badge } from './Badge';
import { EnrollmentsCell } from './EnrollmentsCell';
import type { StudentData } from './state';

type Props = {
  student: StudentData;
  onGroupClick: (e: MouseEvent, group: string) => void;
};

export const StudentTableRow: FC<Props> = props => {
  const router = useRouter();

  const handleRowClick: MouseEventHandler = e => {
    e.preventDefault();
    void router.push(`/auditors/students/${props.student.studentId}`);
  };

  return (
    <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
      <td>{props.student.firstName} {props.student.lastName}</td>
      <td>{props.student.province ? `${props.student.province.name}, ${props.student.country.code}` : props.student.country.code}</td>
      <td>{props.student.groups.map(g => (
        <Fragment key={g}><Badge onClick={e => props.onGroupClick(e, g)} title="Click to filter results by this group">{g}</Badge>{' '}</Fragment>
      ))}</td>
      <EnrollmentsCell enrollments={props.student.enrollments} />
    </tr>
  );
};
