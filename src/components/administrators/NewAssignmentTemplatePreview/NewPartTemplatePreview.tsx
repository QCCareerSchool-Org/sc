import type { FC, MouseEventHandler } from 'react';

import { catchError, EMPTY } from 'rxjs';
import { NewPartMediumView } from '../NewPartMediumView';
import { NewTextBoxTemplatePreview } from './NewTextBoxTemplatePreview';
import { NewUploadSlotTemplatePreview } from './NewUploadSlotTemplatePreview';
import { Description } from '@/components/Description';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import { useAdminServices } from '@/hooks/useAdminServices';
import { endpoint } from 'src/basePath';

type NewPartTemplateWithInputs = NewPartTemplate & {
  newTextBoxTemplates: NewTextBoxTemplate[];
  newUploadSlotTemplates: NewUploadSlotTemplate[];
  newPartMedia: NewPartMedium[];
};

type Props = {
  administratorId: number;
  newPartTemplate: NewPartTemplateWithInputs;
};

export const NewPartTemplatePreview: FC<Props> = ({ administratorId, newPartTemplate }) => {
  const { newPartMediumService } = useAdminServices();
  return (
    <Section>
      <div className="container">
        <h2 className="h3"><span className="text-danger">{newPartTemplate.partNumber}.</span> {newPartTemplate.title}</h2>
        {newPartTemplate.description && <Description description={newPartTemplate.description} descriptionType={newPartTemplate.descriptionType} />}
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            {newPartTemplate.newPartMedia.filter(m => m.type !== 'download').map(m => (
              <figure key={m.partMediumId} className={`figure ${m.type}Figure`}>
                <NewPartMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} newPartMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            ))}
            {newPartTemplate.newPartMedia.filter(m => m.type === 'download').map(m => {
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
            {newPartTemplate.newTextBoxTemplates.map(t => <NewTextBoxTemplatePreview key={t.textBoxTemplateId} newTextBoxTemplate={t} />)}
            {newPartTemplate.newUploadSlotTemplates.map(u => <NewUploadSlotTemplatePreview key={u.uploadSlotTemplateId} newUploadSlotTemplate={u} />)}
          </div>
        </div>
      </div>
      <style jsx>{`
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
    </Section>
  );
};
