import { ReactElement } from 'react';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import { TextBoxFunction, UploadSlotFunction } from '.';
import { PartState } from '@/components/students/NewAssignmentView/state';
import { NewPart, NewTextBox, NewUploadSlot } from '@/domain/students';

type Props = {
  studentId: number;
  unitId: string;
  part: NewPart & { textBoxes: NewTextBox[]; uploadSlots: NewUploadSlot[] };
  state: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
};

export const NewPartForm = ({ studentId, unitId, part, state, saveText, updateText, uploadFile, deleteFile }: Props): ReactElement => {
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col col-md-10 col-lg-8">
            {part.optional && <small className="text-danger">optional</small>}
            <p className="fw-bold">{part.description}</p>
            {part.textBoxes.map((t, i) => <NewTextBoxForm key={t.textBoxId} textBox={t} state={state.textBoxStates[i]} save={saveText} update={updateText} />)}
            {part.uploadSlots.map((u, i) => <NewUploadSlotForm key={u.uploadSlotId} studentId={studentId} unitId={unitId} assignmentId={part.assignmentId} uploadSlot={u} state={state.uploadSlotStates[i]} uploadFile={uploadFile} deleteFile={deleteFile} />)}
          </div>
        </div>
      </div>
    </section>
  );
};
