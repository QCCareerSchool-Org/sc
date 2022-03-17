import type { ReactElement } from 'react';

import { NewPartMediumView } from './NewPartMediumView';
import { NewTextBoxTemplatePreview } from './NewTextBoxTemplatePreview';
import { NewUploadSlotTemplatePreview } from './NewUploadSlotTemplatePreview';
import type { NewDescriptionType } from '@/domain/newDescriptionType';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import { useScreenWidth } from '@/hooks/useScreenWidth';

type NewPartTemplateWithInputs = NewPartTemplate & {
  newTextBoxTemplates: NewTextBoxTemplate[];
  newUploadSlotTemplates: NewUploadSlotTemplate[];
  newPartMedia: NewPartMedium[];
};

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  newPartTemplate: NewPartTemplateWithInputs;
};

export const NewPartTemplatePreview = ({ administratorId, schoolId, courseId, unitId, assignmentId, newPartTemplate }: Props): ReactElement => {
  return (
    <section>
      <div className="container">
        <h2 className="h3"><span className="text-danger">{newPartTemplate.partNumber}.</span> {newPartTemplate.title}</h2>
        {newPartTemplate.description && <Description description={newPartTemplate.description} descriptionType={newPartTemplate.descriptionType} />}
        <div className="row">
          {newPartTemplate.newPartMedia.filter(m => m.type !== 'download').map(m => (
            <div key={m.partMediumId} className="col-12 col-lg-10 col-xl-8">
              <figure className={`figure ${m.type}Figure`}>
                <NewPartMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} partId={newPartTemplate.partTemplateId} newPartMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            </div>
          ))}
        </div>
        <div className="row">
          {newPartTemplate.newPartMedia.filter(m => m.type === 'download').map(m => (
            <div key={m.partMediumId} className="col-4 col-sm-3 col-md-2">
              <figure className={`figure ${m.type}Figure`}>
                <NewPartMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} partId={newPartTemplate.partTemplateId} newPartMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col col-md-10 col-lg-8">
            {newPartTemplate.newTextBoxTemplates.map(t => <NewTextBoxTemplatePreview key={t.textBoxTemplateId} newTextBoxTemplate={t} />)}
            {newPartTemplate.newUploadSlotTemplates.map(u => <NewUploadSlotTemplatePreview key={u.uploadSlotTemplateId} newUploadSlotTemplate={u} />)}
          </div>
        </div>
      </div>
      <style jsx>{`
      .downloadFigure {
        max-width: 136px;
      }
      `}</style>
    </section>
  );
};

type DescriptionProps = {
  description: string;
  descriptionType: NewDescriptionType;
};

const Description = ({ description, descriptionType }: DescriptionProps): ReactElement | null => {
  if (descriptionType === 'text') {
    return (
      <>
        {description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
      </>
    );
  }
  if (descriptionType === 'html') {
    return <div className="htmlDescription" dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return null;
};
