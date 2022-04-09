import type { ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { ProcessingState } from './state';
import { TextBox } from './TextBox';
import { UploadSlot } from './UploadSlot';
import type { MarkSavePayload } from './useMarkSave';
import type { NewPart } from '@/domain/newPart';
import type { NewTextBox } from '@/domain/newTextBox';
import type { NewUploadSlot } from '@/domain/newUploadSlot';

type Props = {
  tutorId: number;
  newPart: NewPart & {
    newTextBoxes: Array<NewTextBox & { state: ProcessingState; errorMessage?: string }>;
    newUploadSlots: Array<NewUploadSlot & { state: ProcessingState; errorMessage?: string }>;
  };
  markSave$: Subject<MarkSavePayload>;
};

export const Part = ({ tutorId, newPart, markSave$ }: Props): ReactElement => (
  <>
    <h2 className="h3"><span className="text-danger">{newPart.partNumber}.</span> {newPart.title}</h2>
    {newPart.description && (
      <>
        {newPart.descriptionType === 'text' && newPart.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
        {newPart.descriptionType === 'html' && <div dangerouslySetInnerHTML={{ __html: newPart.description }} />}
      </>
    )}
    {newPart.markingCriteria && (
      <div className="alert alert-info">
        <h3 className="h6">Part Marking Criteria</h3>
        {newPart.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}
      </div>
    )}
    {newPart.newTextBoxes.map(t => (
      <div key={t.textBoxId} className="row input">
        <TextBox newTextBox={t} tutorId={tutorId} markSave$={markSave$} />
      </div>
    ))}
    {newPart.newUploadSlots.map(u => (
      <div key={u.uploadSlotId} className="row input">
        <UploadSlot newUploadSlot={u} />
      </div>
    ))}
    <style jsx>{`
    .alert p:last-of-type { margin-bottom: 0; }
    .input { margin-bottom: 3rem; }
    .input:last-of-type { margin-bottom: 0; }
    `}</style>
  </>
);
