import type { ReactElement } from 'react';
import { memo, useCallback } from 'react';

import { endpoint } from '../../../basePath';
import { MarkForm } from './MarkForm';
import { Medium } from './Medium';
import type { PartWithForms } from './state';
import { TextBox } from './TextBox';
import { UploadSlot } from './UploadSlot';
import type { InputType } from './useInputSave';

type Props = {
  tutorId: number;
  newPart: PartWithForms;
  saveInput: (type: InputType, partId: string, id: string, mark: number | null, notes: string | null) => void;
};

export const Part = memo(({ tutorId, newPart, saveInput }: Props): ReactElement => {
  const saveTextBox = useCallback((partId: string, id: string, mark: number | null, notes: string | null): void => {
    saveInput('text box', partId, id, mark, notes);
  }, [ saveInput ]);

  const saveUploadSlot = useCallback((partId: string, id: string, mark: number | null, notes: string | null): void => {
    saveInput('upload slot', partId, id, mark, notes);
  }, [ saveInput ]);

  return (
    <>
      <h2 className="h3" id={newPart.partId}><span className="text-danger">{newPart.partNumber}.</span> {newPart.title}</h2>
      {newPart.description && (
        <>
          {newPart.descriptionType === 'text' && newPart.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          {newPart.descriptionType === 'html' && <div dangerouslySetInnerHTML={{ __html: newPart.description }} />}
        </>
      )}
      {newPart.newPartMedia.filter(m => m.type !== 'download').map(m => {
        const src = `${endpoint}/tutors/${tutorId}/newPartMedia/${m.partMediumId}/file`;
        return (
          <figure key={m.partMediumId} className={`figure ${m.type}Figure d-block`}>
            <Medium className="figure-img mb-0 mw-100" medium={m} src={src} />
            <figcaption className="figure-caption">{m.caption}</figcaption>
          </figure>
        );
      })}
      {newPart.markingCriteria && (
        <div className="alert alert-info">
          <h3 className="h6">Part Marking Criteria</h3>
          {newPart.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}
        </div>
      )}
      {newPart.newTextBoxes.map(t => (
        <div key={t.textBoxId} className="input">
          <TextBox newTextBox={t} />
          <MarkForm id={t.textBoxId} partId={t.partId} points={t.points} mark={t.mark} notes={t.notes} form={t.form} save={saveTextBox} />
        </div>
      ))}
      {newPart.newUploadSlots.map(u => (
        <div key={u.uploadSlotId} className="input">
          <UploadSlot tutorId={tutorId} newUploadSlot={u} />
          <MarkForm id={u.uploadSlotId} partId={u.partId} points={u.points} mark={u.mark} notes={u.notes} form={u.form} save={saveUploadSlot} />
        </div>
      ))}
      <style jsx>{`
      .alert p:last-of-type { margin-bottom: 0; }
      .input { margin-bottom: 2.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.25); padding-bottom: 2.5rem; }
      .input:last-of-type { margin-bottom: 0; border-bottom: 0; padding-bottom: 0; }
      `}</style>
    </>
  );
});

Part.displayName = 'Part';
