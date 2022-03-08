import { memo, MouseEvent, ReactElement } from 'react';

import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';

type Props = {
  assignments: NewAssignmentTemplate[];
  assignmentRowClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const NewAssignmentTemplateList = memo(({ assignments, assignmentRowClick }: Props): ReactElement => (
  <>
    {assignments.length === 0
      ? <p>no assignments</p>
      : (
        <table id="newAssignmentTemplatesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.assignmentTemplateId} onClick={e => assignmentRowClick(e, a.assignmentTemplateId)}>
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
      #newAssignmentTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewAssignmentTemplateList.displayName = 'NewAssignmentTemplateList';
