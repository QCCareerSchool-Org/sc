import { memo, useCallback } from 'react';
import type { FC, MouseEventHandler } from 'react';
import { catchError, EMPTY } from 'rxjs';

import { endpoint } from '../../../basePath';
import { MarkForm } from './MarkForm';
import { NewTextBoxView } from './NewTextBoxView';
import { NewUploadSlotView } from './NewUploadSlotView';
import type { PartWithForms } from './state';
import type { InputType } from './useInputSave';
import { NewPartMediumView } from '@/components/administrators/NewPartMediumView';
import { Description } from '@/components/Description';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useServices } from '@/hooks/useServices';

type Props = {
  administratorId: number;
  part: PartWithForms;
  saveInput: (type: InputType, partId: string, id: string, markOverride: number | null) => void;
};

export const NewPartView: FC<Props> = memo(({ administratorId, part, saveInput }) => {
  const { gradeService } = useServices();
  const { newPartMediumService } = useAdminServices();

  const saveTextBox = useCallback((partId: string, id: string, markOverride: number | null): void => {
    saveInput('text box', partId, id, markOverride);
  }, [ saveInput ]);

  const saveUploadSlot = useCallback((partId: string, id: string, markOverride: number | null): void => {
    saveInput('upload slot', partId, id, markOverride);
  }, [ saveInput ]);

  return (
    <>
      <Section>
        <div className="container">
          <h2 className="h3"><span className="text-danger">{part.partNumber}.</span> {part.title}</h2>
          {part.description && <Description description={part.description} descriptionType={part.descriptionType} />}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {part.newPartMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.partMediumId} className={`figure ${m.type}Figure`}>
                  <NewPartMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} newPartMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {part.newPartMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/administrators/${administratorId}/newPartMedia/${m.partMediumId}/file`;
                const handleDownloadClick: MouseEventHandler = e => {
                  e.preventDefault();
                  newPartMediumService.downloadPartMediumFile(administratorId, m.partMediumId).pipe(
                    catchError(() => EMPTY),
                  ).subscribe();
                };
                return (
                  <div key={m.partMediumId} className="downloadMedium">
                    <a href={href} download={m.filename} onClick={handleDownloadClick}>
                      <DownloadMedium medium={m} />
                    </a>
                  </div>
                );
              })}
              {part.markingCriteria && (
                <div className="alert alert-info">
                  <h3 className="h6">Part Marking Criteria</h3>
                  {part.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}
                </div>
              )}
              {part.newTextBoxes.map(t => (
                <div key={t.textBoxId} className="input">
                  <NewTextBoxView key={t.textBoxId} textBox={t} />
                  <MarkForm id={t.textBoxId} partId={t.partId} points={t.points} mark={t.mark} markOverride={t.markOverride} notes={t.notes} form={t.form} save={saveTextBox} />
                </div>
              ))}
              {part.newUploadSlots.map(u => (
                <div key={u.uploadSlotId} className="input">
                  <NewUploadSlotView key={u.uploadSlotId} administratorId={administratorId} uploadSlot={u} />
                  <MarkForm id={u.uploadSlotId} partId={u.partId} points={u.points} mark={u.mark} markOverride={u.markOverride} notes={u.notes} form={u.form} save={saveUploadSlot} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <style jsx>{`
      .alert p:last-of-type { margin-bottom: 0; }
      .input { margin-bottom: 2.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.25); padding-bottom: 2.5rem; }
      .input:last-of-type { margin-bottom: 0; border-bottom: 0; padding-bottom: 0; }
      .downloadMedium {
        margin-bottom: 1rem;
      }
      .downloadMedium:last-of-type {
        margin-bottom: 0;
      }
      .downloadMedium a {
        text-decoration: none;
        color: inherit;
      }
      `}</style>
    </>
  );
});

NewPartView.displayName = 'NewPartView';
