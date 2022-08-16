import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { useServices } from '@/hooks/useServices';
import type { NewUnitWithEnrollmentAndAssignments } from '@/services/tutors/newUnitService';

type Props = {
  unit: NewUnitWithEnrollmentAndAssignments;
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
          {props.unit.mark !== null && <th className="text-center">Grade</th>}
        </tr>
      </thead>
      <tbody>
        {props.unit.newAssignments.filter(a => a.complete).map(a => (
          <tr onClick={e => props.onClick(e, a.assignmentId)} key={a.assignmentId}>
            <td className="text-center">{a.assignmentNumber}</td>
            <td>{a.title ?? '(none)'}</td>
            {a.points === 0
              ? <td colSpan={props.unit.mark === null ? 2 : 3} className="text-center">n/a</td>
              : (
                <>
                  <td className="text-center">{a.mark === null ? '---' : a.mark}</td>
                  <td className="text-center">{a.points}</td>
                  {a.mark !== null && <td className="text-center">{gradeService.calculate(a.mark, a.points, props.unit.created)}</td>}
                </>
              )
            }
          </tr>
        ))}
      </tbody>
      {props.unit.mark !== null && (
        <tfoot>
          <tr>
            <td colSpan={2} />
            <td className="text-center">{props.unit.mark}</td>
            <td className="text-center">{props.unit.points}</td>
            <td className="text-center">{gradeService.calculate(props.unit.mark, props.unit.points, props.unit.created)}</td>
          </tr>
        </tfoot>
      )}
    </table>
  );
});

AssignmentTable.displayName = 'AssignmentTable';
