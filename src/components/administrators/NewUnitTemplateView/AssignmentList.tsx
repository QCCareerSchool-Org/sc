import type { MouseEvent, ReactElement } from 'react';

import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';

type Props = {
  assignments: NewAssignmentTemplate[];
  assignmentRowClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const AssignmentList = ({ assignments, assignmentRowClick }: Props): ReactElement => (
  <>
    {assignments.length === 0
      ? <p>no assignments</p>
      : (
        <table id="assignmentsTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.unitId} onClick={e => assignmentRowClick(e, a.assignmentId)}>
                <td className="text-center">{a.assignmentNumber}</td>
                <td>{a.title}</td>
                <td className="text-center">{a.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #assignmentsTable tr { cursor: pointer }
    `}</style>
  </>
);
