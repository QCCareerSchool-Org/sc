import type { ReactElement } from 'react';

import type { NewUploadSlot } from '@/domain/newUploadSlot';

type Props = {
  newUploadSlot: NewUploadSlot;
};

export const UploadSlot = ({ newUploadSlot }: Props): ReactElement => {
  return (
    <>
      <label className="form-label">{newUploadSlot.label}:</label>
      <div><a href="">{newUploadSlot.filename}</a></div>
    </>
  );
};
