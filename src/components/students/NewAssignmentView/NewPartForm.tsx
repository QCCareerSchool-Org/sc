import { memo, ReactElement } from 'react';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import type { TextBoxFunction, UploadSlotFunction } from '.';
import type { PartState } from '@/components/students/NewAssignmentView/state';

type Props = {
  part: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const NewPartForm = memo(({ part, saveText, updateText, uploadFile, deleteFile, downloadFile }: Props): ReactElement => (
  <section>
    <div className="container">
      <div className="row">
        <div className="col col-md-10 col-lg-8">
          {part.optional && <small className="text-danger">optional</small>}
          <p className="fw-bold">{part.description}</p>
          {part.textBoxes.map(t => (
            <NewTextBoxForm
              key={t.textBoxId}
              textBox={t}
              save={saveText}
              update={updateText}
            />
          ))}
          {part.uploadSlots.map(u => (
            <NewUploadSlotForm
              key={u.uploadSlotId}
              uploadSlot={u}
              uploadFile={uploadFile}
              deleteFile={deleteFile}
              downloadFile={downloadFile}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
));

NewPartForm.displayName = 'NewPartForm';
