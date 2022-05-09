import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';

type Props = {
  assignments: NewAssignmentTemplate[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, assignmentId: string) => void;
};

export const NewAssignmentTemplateList = memo((props: Props): ReactElement => {
  const { assignments } = props;
  return (
    <>
      {assignments.length === 0
        ? <p>no assignments</p>
        : (
          <table className="newAssignmentTemplatesTable table table-bordered table-hover w-auto bg-white">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">Optional</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.assignmentTemplateId} onClick={e => props.onClick(e, a.assignmentTemplateId)}>
                  <td className="text-center">{a.assignmentNumber}</td>
                  <td>{a.title ?? '(none)'}</td>
                  <td className="text-center">{a.optional ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <style jsx>{`
      .newAssignmentTemplatesTable tr { cursor: pointer }
      `}</style>
    </>
  );
});

NewAssignmentTemplateList.displayName = 'NewAssignmentTemplateList';
