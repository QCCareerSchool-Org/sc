import { memo, MouseEvent, ReactElement } from 'react';

import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';

type Props = {
  uploadSlots: NewUploadSlotTemplate[];
  uploadSlotRowClick: (e: MouseEvent<HTMLTableRowElement>, uploadSlotId: string) => void;
};

export const NewUploadSlotTemplateList = memo(({ uploadSlots, uploadSlotRowClick }: Props): ReactElement => (
  <>
    {uploadSlots.length === 0
      ? <p>no upload slots</p>
      : (
        <table id="newUploadSlotTemplatesTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th>Label</th>
              <th>Allowed Types</th>
              <th className="text-center">Points</th>
              <th className="text-center">Order</th>
              <th className="text-center">Optional</th>
            </tr>
          </thead>
          <tbody>
            {uploadSlots.map(u => (
              <tr key={u.uploadSlotTemplateId} onClick={e => uploadSlotRowClick(e, u.uploadSlotTemplateId)}>
                <td>{trimLabel(u.label)}</td>
                <td>{u.allowedTypes.join(',')}</td>
                <td className="text-center">{u.points}</td>
                <td className="text-center">{u.order}</td>
                <td className="text-center">{u.optional ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #newUploadSlotTemplatesTable tr { cursor: pointer }
    `}</style>
  </>
));

NewUploadSlotTemplateList.displayName = 'NewUploadSlotTemplateList';

const trimLabel = (label: string, maxLength = 32): string => {
  if (label.length <= maxLength) {
    return label;
  }
  return label.substring(0, maxLength - 1) + '…';
};
