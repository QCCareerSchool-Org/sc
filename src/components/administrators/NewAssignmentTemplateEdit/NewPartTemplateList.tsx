import { memo, MouseEvent, ReactElement } from 'react';

import type { NewPartTemplate } from '@/domain/newPartTemplate';

type Props = {
  parts: NewPartTemplate[];
  partRowClick: (e: MouseEvent<HTMLTableRowElement>, partId: string) => void;
};

export const NewPartTemplateList = memo(({ parts, partRowClick }: Props): ReactElement => (
  <>
    {parts.length === 0
      ? <p>no parts</p>
      : (
        <table id="newPartTemplatesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(p => (
              <tr key={p.partTemplateId} onClick={e => partRowClick(e, p.partTemplateId)}>
                <td className="text-center">{p.partNumber}</td>
                <td>{p.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #newPartTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewPartTemplateList.displayName = 'NewPartTemplateList';
