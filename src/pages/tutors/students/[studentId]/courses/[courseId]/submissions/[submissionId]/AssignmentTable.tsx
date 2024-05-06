import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { useServices } from '@/hooks/useServices';
import type { NewSubmissionWithEnrollmentAndAssignments } from '@/services/tutors/newSubmissionService';

type Props = {
  newSubmission: NewSubmissionWithEnrollmentAndAssignments;
  onClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const AssignmentTable: FC<Props> = memo(props => {
  const { gradeService } = useServices();

  return (
    <table className="table table-bordered table-hover bg-white w-auto">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th>Title</th>
          <th className="text-center">Mark</th>
          <th className="text-center">Points</th>
          {props.newSubmission.mark !== null && <th className="text-center">Grade</th>}
        </tr>
      </thead>
      <tbody>
        {props.newSubmission.newAssignments.filter(a => a.complete).map(a => {
          // const modified = props.newSubmission.hasParent && a.parts.some(p => p.textBoxes.some(t => t.modified.getTime() !== t.created.getTime()) || p.uploadSlots.some(u => u.modified.getTime() !== u.created.getTime())));
          return (
            <tr onClick={e => props.onClick(e, a.assignmentId)} key={a.assignmentId}>
              <td className="text-center">{a.assignmentNumber}</td>
              <td>{a.title ?? '(none)'}</td>
              {a.points === 0
                ? <td colSpan={props.newSubmission.mark === null ? 2 : 3} className="text-center">n/a</td>
                : (
                  <>
                    <td className="text-center">{a.mark === null ? '---' : a.mark}</td>
                    <td className="text-center">{a.points}</td>
                    {a.mark !== null && <td className="text-center">{gradeService.calculate(a.mark, a.points, props.newSubmission.created)}</td>}
                  </>
                )
              }
            </tr>
          );
        })}
      </tbody>
      {props.newSubmission.mark !== null && (
        <tfoot>
          <tr>
            <td colSpan={2} />
            <td className="text-center">{props.newSubmission.mark}</td>
            <td className="text-center">{props.newSubmission.points}</td>
            <td className="text-center">{gradeService.calculate(props.newSubmission.mark, props.newSubmission.points, props.newSubmission.created)}</td>
          </tr>
        </tfoot>
      )}
    </table>
  );
});

AssignmentTable.displayName = 'AssignmentTable';
