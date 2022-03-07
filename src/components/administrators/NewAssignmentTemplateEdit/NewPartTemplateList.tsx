import { memo, MouseEvent, ReactElement } from 'react';

import type { NewPartTemplate } from '@/domain/index';

type Props = {
  parts: NewPartTemplate[];
  partRowClick: (e: MouseEvent<HTMLTableRowElement>, partId: string) => void;
};

export const NewPartTemplateList = memo(({ parts, partRowClick }: Props): ReactElement => (
  <>
    {parts.length === 0
      ? <p>no parts</p>
      : (
        <table id="hewPartTemplatesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(p => (
              <tr key={p.partId} onClick={e => partRowClick(e, p.partId)}>
                <td className="text-center">{p.partNumber}</td>
                <td>{p.title}</td>
                <td className="text-center">{p.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #hewPartTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewPartTemplateList.displayName = 'NewPartTemplateList';
