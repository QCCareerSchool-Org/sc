import type { FC } from 'react';

import type { Award } from '@/domain/award';
import { formatDate } from 'src/formatDate';

type Props = {
  awards: Award[];
};

export const AwardsTable: FC<Props> = ({ awards }) => {
  if (awards.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Course</th>
          <th>School</th>
          <th>Grade</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {awards.map(a => (
          <tr key={a.submissionId}>
            <td>{a.name}</td>
            <td>{a.courseName}</td>
            <td>{a.schoolName}</td>
            <td>{a.grade}</td>
            <td>{formatDate(a.created)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
