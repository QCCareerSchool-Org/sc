import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewUnitWithEnrollmentAndAssignments } from '@/services/tutors/newUnitService';

type Props = {
  unit: NewUnitWithEnrollmentAndAssignments;
  onClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const AssignmentTable = memo(({ unit, onClick }: Props): ReactElement => (
  <table className="table table-bordered table-hover bg-white w-auto">
    <thead>
      <tr>
        <th className="text-center">#</th>
        <th>Title</th>
        <th className="text-center">Mark</th>
        <th className="text-center">Points</th>
      </tr>
    </thead>
    <tbody>
      {unit.newAssignments.filter(a => a.complete).map(a => (
        <tr onClick={e => onClick(e, a.assignmentId)} key={a.assignmentId}>
          <td className="text-center">{a.assignmentNumber}</td>
          <td>{a.title ?? '(none)'}</td>
          {a.points === 0
            ? <td colSpan={2} className="text-center">n/a</td>
            : (
              <>
                <td className="text-center">{a.mark === null ? '---' : a.mark}</td>
                <td className="text-center">{a.points}</td>
              </>
            )
          }
        </tr>
      ))}
    </tbody>
    {unit.mark !== null && (
      <tfoot>
        <tr>
          <td colSpan={2} />
          <td className="text-center">{unit.mark}</td>
          <td className="text-center">{unit.points}</td>
        </tr>
      </tfoot>
    )}
  </table>
));

AssignmentTable.displayName = 'AssignmentTable';
