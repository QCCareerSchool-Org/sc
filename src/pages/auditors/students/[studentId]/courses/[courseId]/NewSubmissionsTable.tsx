import type { FC } from 'react';

import { NewSubmissionStatus } from './NewSubmissionStatus';
import type { NewSubmission } from '@/domain/auditor/newSubmission';
import type { Tutor } from '@/domain/auditor/tutor';
import { useServices } from '@/hooks/useServices';

type Props = {
  newSubmissions: Array<NewSubmission & {
    tutor: Tutor | null;
  }>;
};

export const NewSubmissionsTable: FC<Props> = ({ newSubmissions }) => {
  const { gradeService } = useServices();

  return (
    <div className="mt-4">
      <h2>Assignments</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center">Unit</th>
            <th>Title</th>
            <th>Status</th>
            <th>Tutor</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {newSubmissions.map(s => (
            <tr key={s.submissionId}>
              <td className="text-center">{s.unitLetter}</td>
              <td>{s.title}</td>
              <td><NewSubmissionStatus newSubmission={s} /></td>
              <td>{s.tutor ? `${s.tutor.firstName} ${s.tutor.lastName}` : 'N/A'}</td>
              <td>{s.mark !== null && s.points > 0 ? gradeService.calculate(s.mark, s.points, s.created) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
