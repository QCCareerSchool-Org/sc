import type { FC } from 'react';
import { memo, useCallback } from 'react';

import { MarkForm } from './MarkForm';
import { Medium } from './Medium';
import type { PartWithForms } from './state';
import { TextBox } from './TextBox';
import { UploadSlot } from './UploadSlot';
import type { InputType } from './useInputSave';
import { Description } from '@/components/Description';
import { endpoint } from 'src/basePath';

type Props = {
  tutorId: number;
  newPart: PartWithForms;
  saveInput: (type: InputType, partId: string, id: string, mark: number | null, notes: string | null) => void;
  submissionClosed: boolean;
  submissionIsRedo: boolean;
};

export const Part: FC<Props> = memo(({ tutorId, newPart, saveInput, submissionClosed, submissionIsRedo }) => {
  const partModified = newPart.newTextBoxes.some(t => t.modified !== null && t.modified.getTime() !== t.created.getTime()) || newPart.newUploadSlots.some(u => u.modified !== null && u.modified.getTime() !== u.created.getTime());

  const saveTextBox = useCallback((partId: string, id: string, mark: number | null, notes: string | null): void => {
    if (!partModified) {
      return;
    }
    saveInput('text box', partId, id, mark, notes);
  }, [ partModified, saveInput ]);

  const saveUploadSlot = useCallback((partId: string, id: string, mark: number | null, notes: string | null): void => {
    if (!partModified) {
      return;
    }
    saveInput('upload slot', partId, id, mark, notes);
  }, [ partModified, saveInput ]);

  return (
    <>
      <h2 className="h3" id={newPart.partId}><span className="text-danger">{newPart.partNumber}.</span> {newPart.title}</h2>
      {newPart.description && <Description description={newPart.description} descriptionType={newPart.descriptionType} />}
      {newPart.newPartMedia.filter(m => m.type !== 'download').map(m => {
        const src = `${endpoint}/tutors/${tutorId}/newPartMedia/${m.partMediumId}/file`;
        return (
          <figure key={m.partMediumId} className={`figure ${m.type}Figure d-block`}>
            <Medium className="figure-img mb-0 mw-100" medium={m} src={src} />
            <figcaption className="figure-caption">{m.caption}</figcaption>
          </figure>
        );
      })}
      <div className="alert alert-info">
        <h3 className="h6">Part Marking Criteria</h3>
        {newPart.markingCriteria !== null && <>{newPart.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}</>}
        <strong>Score:</strong> /{newPart.newTextBoxes.reduce((total, t) => total + t.points, 0) + newPart.newUploadSlots.reduce((total, u) => total + u.points, 0)}
      </div>
      {newPart.newTextBoxes.map(t => {
        const modified = t.modified !== null && t.modified.getTime() !== t.created.getTime();
        return (
          <div key={t.textBoxId} className="input">
            <TextBox newTextBox={t} modified={modified} submissionIsRedo={submissionIsRedo} />
            <MarkForm id={t.textBoxId} partId={t.partId} points={t.points} mark={t.mark} notes={t.notes} form={t.form} save={saveTextBox} submissionClosed={submissionClosed} submissionIsRedo={submissionIsRedo} modified={modified} />
          </div>
        );
      })}
      {newPart.newUploadSlots.map(u => {
        const modified = u.modified !== null && u.modified.getTime() !== u.created.getTime();
        return (
          <div key={u.uploadSlotId} className="input">
            <UploadSlot tutorId={tutorId} newUploadSlot={u} modified={modified} submissionIsRedo={submissionIsRedo} />
            <MarkForm id={u.uploadSlotId} partId={u.partId} points={u.points} mark={u.mark} notes={u.notes} form={u.form} save={saveUploadSlot} submissionClosed={submissionClosed} submissionIsRedo={submissionIsRedo} modified={modified} />
          </div>
        );
      })}
      <style jsx>{`
      .alert p:last-of-type { margin-bottom: 0; }
      .input { margin-bottom: 2.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.25); padding-bottom: 2.5rem; }
      .input:last-of-type { margin-bottom: 0; border-bottom: 0; padding-bottom: 0; }
      `}</style>
    </>
  );
});

Part.displayName = 'Part';
