import { memo, MouseEvent, ReactElement } from 'react';

import type { NewTextBoxTemplate } from '@/domain/index';

type Props = {
  textBoxes: NewTextBoxTemplate[];
  textBoxRowClick: (e: MouseEvent<HTMLTableRowElement>, textBoxId: string) => void;
};

export const TextBoxList = memo(({ textBoxes, textBoxRowClick }: Props): ReactElement => (
  <>
    {textBoxes.length === 0
      ? <p>no text boxes</p>
      : (
        <table id="textBoxesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-center">Points</th>
              <th className="text-center">Lines</th>
              <th className="text-center">Order</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {textBoxes.map(t => (
              <tr key={t.textBoxId} onClick={e => textBoxRowClick(e, t.textBoxId)} title={t.description ?? undefined}>
                <td>{t.description === null ? '(none)' : trimDescription(t.description)}</td>
                <td className="text-center">{t.points}</td>
                <td className="text-center">{t.lines ?? '(default)'}</td>
                <td className="text-center">{t.order}</td>
                <td className="text-center">{t.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #textBoxesTable tr { cursor: pointer }
    `}</style>
  </>
));

TextBoxList.displayName = 'TextBoxList';

const trimDescription = (description: string, maxLength = 48): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 1) + '…';
};
