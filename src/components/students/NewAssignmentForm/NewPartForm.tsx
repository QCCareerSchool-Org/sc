import { ReactElement } from 'react';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import { TextBoxFunction, UploadSlotFunction } from '.';
import { PartState } from '@/components/students/NewAssignmentForm/state';
import { NewPart, NewTextBox, NewUploadSlot } from '@/domain/students';

type Props = {
  part: NewPart & { textBoxes: NewTextBox[]; uploadSlots: NewUploadSlot[] };
  state: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
};

export const NewPartForm = ({ part, state, saveText, updateText, uploadFile, deleteFile }: Props): ReactElement => {
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col col-md-10 col-lg-8">
            {part.optional && <small className="text-danger">optional</small>}
            <p className="fw-bold">{part.description}</p>
            {part.textBoxes.map((t, i) => <NewTextBoxForm key={t.textBoxId} textBox={t} state={state.textBoxStates[i]} save={saveText} update={updateText} />)}
            {part.uploadSlots.map((u, i) => <NewUploadSlotForm key={u.uploadSlotId} uploadSlot={u} state={state.uploadSlotStates[i]} uploadFile={uploadFile} deleteFile={deleteFile} />)}
          </div>
        </div>
      </div>
    </section>
  );
};
