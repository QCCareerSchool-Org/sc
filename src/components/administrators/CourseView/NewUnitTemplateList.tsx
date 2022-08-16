import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { NewUnitTemplate } from '@/domain/newUnitTemplate';

type Props = {
  units: NewUnitTemplate[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, unitId: string) => void;
};

export const NewUnitTemplateList: FC<Props> = memo(props => (
  <>
    {props.units.length === 0
      ? <p>no units</p>
      : (
        <table className="newUnitTemplatesTable table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {props.units.map(u => (
              <tr key={u.unitTemplateId} onClick={e => props.onClick(e, u.unitTemplateId)}>
                <td className="text-center">{u.unitLetter}</td>
                <td>{u.title ?? '(none)'}</td>
                <td className="text-center">{u.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      .newUnitTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewUnitTemplateList.displayName = 'NewUnitTemplateList';
