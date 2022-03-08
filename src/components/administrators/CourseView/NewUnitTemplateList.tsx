import { memo, MouseEvent, ReactElement } from 'react';

import type { NewUnitTemplate } from '@/domain/newUnitTemplate';

type Props = {
  units: NewUnitTemplate[];
  unitRowClick: (e: MouseEvent<HTMLTableRowElement>, unitId: string) => void;
};

export const NewUnitTemplateList = memo(({ units, unitRowClick }: Props): ReactElement => (
  <>
    {units.length === 0
      ? <p>no units</p>
      : (
        <table id="newUnitTemplatesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Title</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {units.map(u => (
              <tr key={u.unitTemplateId} onClick={e => unitRowClick(e, u.unitTemplateId)}>
                <td className="text-center">{u.unitLetter}</td>
                <td>{u.title}</td>
                <td className="text-center">{u.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #newUnitTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewUnitTemplateList.displayName = 'NewUnitTemplateList';
