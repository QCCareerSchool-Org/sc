import type { ReactElement } from 'react';

import { NewPartMediumView } from './NewPartMediumView';
import { NewTextBoxTemplatePreview } from './NewTextBoxTemplatePreview';
import { NewUploadSlotTemplatePreview } from './NewUploadSlotTemplatePreview';
import type { NewDescriptionType } from '@/domain/newDescriptionType';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';

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
        <div className="col col-md-10 col-lg-8">
          {newPartTemplate.description && <Description description={newPartTemplate.description} descriptionType={newPartTemplate.descriptionType} />}
          {newPartTemplate.newPartMedia.map(m => (
            <figure key={m.partMediumId} className={`figure ${m.type !== 'download' ? 'd-block' : ''}`}>
              <NewPartMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} partId={newPartTemplate.partTemplateId} newPartMedium={m} />
              <figcaption className="figure-caption">{m.caption}</figcaption>
            </figure>
          ))}
          {newPartTemplate.newTextBoxTemplates.map(t => <NewTextBoxTemplatePreview key={t.textBoxTemplateId} newTextBoxTemplate={t} />)}
          {newPartTemplate.newUploadSlotTemplates.map(u => <NewUploadSlotTemplatePreview key={u.uploadSlotTemplateId} newUploadSlotTemplate={u} />)}
        </div>
      </div>
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
