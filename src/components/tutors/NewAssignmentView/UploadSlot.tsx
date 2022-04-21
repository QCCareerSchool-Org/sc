import type { ReactElement } from 'react';

import type { WithInputForm } from './state';
import type { NewUploadSlot } from '@/domain/newUploadSlot';
import { endpoint } from 'src/basePath';

type Props = {
  tutorId: number;
  newUploadSlot: WithInputForm<NewUploadSlot>;
};

export const UploadSlot = ({ tutorId, newUploadSlot }: Props): ReactElement => {
  const src = `${endpoint}/tutors/${tutorId}/newUploadSlots/${newUploadSlot.uploadSlotId}/file`;

  return (
    <div className="row">
      <label className="form-label">{newUploadSlot.label}:</label>
      <div className="col-12 col-lg-8 uploadSlotColumn">
        <div><a href="">{newUploadSlot.filename}</a></div>
        {newUploadSlot.mimeType?.startsWith('image/') && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" />
        )}
      </div>
    </div>
  );
};
