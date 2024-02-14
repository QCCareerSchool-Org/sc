import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { StudentData } from './state';
import { StudentTableRow } from './StudentTableRow';
import { Spinner } from '@/components/Spinner';

type Props = {
  students?: StudentData[];
  onGroupClick: (e: MouseEvent, group: string) => void;
};

export const StudentTable: FC<Props> = memo(props => {
  if (!props.students) {
    return <Spinner size="lg" />;
  }

  return (
    <>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Groups</th>
            <th>Courses</th>
          </tr>
        </thead>
        <tbody>
          {props.students.map(s => (
            <StudentTableRow key={s.studentId} student={s} onGroupClick={props.onGroupClick} />
          ))}
        </tbody>
      </table>
    </>
  );
});

StudentTable.displayName = 'StudentTable';
