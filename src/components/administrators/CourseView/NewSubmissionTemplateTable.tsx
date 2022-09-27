import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';

type Props = {
  submissions: NewSubmissionTemplate[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, unitId: string) => void;
};

export const NewSubmissionTemplateTable: FC<Props> = memo(props => (
  <>
    <table className="newUnitTemplatesTable table table-bordered table-hover w-auto bg-white">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th>Title</th>
          <th className="text-center">Optional</th>
        </tr>
      </thead>
      <tbody>
        {props.submissions.map(s => (
          <tr key={s.submissionTemplateId} onClick={e => props.onClick(e, s.submissionTemplateId)}>
            <td className="text-center">{s.unitLetter}</td>
            <td>{s.title ?? '(none)'}</td>
            <td className="text-center">{s.optional ? 'yes' : 'no'}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
      .newUnitTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewSubmissionTemplateTable.displayName = 'NewSubmissionTemplateTable';
