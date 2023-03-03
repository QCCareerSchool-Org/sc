import { memo } from 'react';
import type { FC, MouseEvent } from 'react';

import type { NewAssignment } from '@/domain/administrator/newAssignment';
import { useServices } from '@/hooks/useServices';

type Props = {
  assignments: NewAssignment[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const NewAssignmentList: FC<Props> = memo(props => {
  const { assignments } = props;
  const { gradeService } = useServices();

  return (
    <>
      {assignments.length === 0
        ? <p>no assignments</p>
        : (
          <table className="newAssignmentsTable table table-bordered table-hover w-auto bg-white">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">Points</th>
                <th className="text-center">Mark</th>
                <th className="text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.assignmentId} onClick={e => props.onClick(e, a.assignmentId)}>
                  <td className="text-center">{a.assignmentNumber}</td>
                  <td>{a.title}</td>
                  <td className="text-center">{a.points}</td>
                  <td className="text-center">
                    {a.points === 0
                      ? 'n/a'
                      : a.markOverride
                        ? <span className="override">{a.markOverride}</span>
                        : a.mark ?? '--'
                    }
                  </td>
                  <td className="text-center">{gradeService.calculate(a.markOverride ?? a.mark, a.points, a.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <style jsx>{`
      .newAssignmentsTable tr { cursor: pointer }
      .override { color: #f00 }
      `}</style>
    </>
  );
});

NewAssignmentList.displayName = 'NewAssignmentList';
