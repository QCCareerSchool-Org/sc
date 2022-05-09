import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';

type Props = {
  textBoxes: NewTextBoxTemplate[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, textBoxId: string) => void;
};

export const NewTextBoxTemplateList = memo((props: Props): ReactElement => {
  const { textBoxes } = props;
  return (
    <>
      {textBoxes.length === 0
        ? <p>no text boxes</p>
        : (
          <table className="newTextBoxTemplatesTable table table-bordered table-hover w-auto bg-white">
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
                <tr key={t.textBoxTemplateId} onClick={e => props.onClick(e, t.textBoxTemplateId)} title={t.description ?? undefined}>
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
      .newTextBoxTemplatesTable tr { cursor: pointer }
      `}</style>
    </>
  );
});

NewTextBoxTemplateList.displayName = 'NewTextBoxTemplateList';

const trimDescription = (description: string, maxLength = 48): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 1) + '…';
};
