import type { FC } from 'react';

import { EnrollmentsTableRow } from './EnrollmentsTableRow';
import type { StudentData } from './state';

type Props = {
  student: StudentData;
};

export const EnrollmentsTable: FC<Props> = ({ student }) => {
  return (
    <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Enrollment Date</th>
          <th>Tutor</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {student.enrollments.map(e => <EnrollmentsTableRow key={e.enrollmentId} enrollment={e} />)}
      </tbody>
    </table>
  );
};
