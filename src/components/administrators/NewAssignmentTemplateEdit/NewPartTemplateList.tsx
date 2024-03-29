import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { NewPartTemplate } from '@/domain/newPartTemplate';

type Props = {
  parts: NewPartTemplate[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, partId: string) => void;
};

export const NewPartTemplateList: FC<Props> = memo(props => {
  const { parts } = props;
  return (
    <>
      {parts.length === 0
        ? <p>no parts</p>
        : (
          <table className="newPartTemplatesTable table table-bordered table-hover w-auto bg-white">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(p => (
                <tr key={p.partTemplateId} onClick={e => props.onClick(e, p.partTemplateId)}>
                  <td className="text-center">{p.partNumber}</td>
                  <td>{p.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <style jsx>{`
      .newPartTemplatesTable tr { cursor: pointer }
      `}</style>
    </>
  );
});

NewPartTemplateList.displayName = 'NewPartTemplateList';
