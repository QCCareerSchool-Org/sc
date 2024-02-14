import type { FC } from 'react';
import { memo } from 'react';

import type { StudentData } from './state';
import { StudentTableRow } from './studentTableRowx';
import { Spinner } from '@/components/Spinner';

type Props = {
  students?: StudentData[];
};

export const StudentTable: FC<Props> = memo(({ students }) => {
  if (!students) {
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
          {students.map(s => (
            <StudentTableRow key={s.studentId} student={s} />
          ))}
        </tbody>
      </table>
    </>
  );
});

StudentTable.displayName = 'StudentTable';
