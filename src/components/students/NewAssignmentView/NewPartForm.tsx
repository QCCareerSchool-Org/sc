import type { ReactElement } from 'react';
import { memo } from 'react';

import { NewPartMediumView } from './NewPartMediumView';
import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import type { TextBoxFunction, UploadSlotFunction } from '.';
import { DownloadMedium } from '@/components/DownloadMedium';
import type { PartState } from '@/components/students/NewAssignmentView/state';
import type { NewDescriptionType } from '@/domain/newDescriptionType';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  part: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const NewPartForm = memo(({ studentId, courseId, unitId, assignmentId, part, saveText, updateText, uploadFile, deleteFile, downloadFile }: Props): ReactElement => {
  return (
    <section>
      <div className="container">
        <h2 className="h3"><span className="text-danger">{part.partNumber}.</span> {part.title}</h2>
        {part.description && <Description description={part.description} descriptionType={part.descriptionType} />}
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            {part.newPartMedia.filter(m => m.type !== 'download').map(m => (
              <figure key={m.partMediumId} className={`figure ${m.type}Figure`}>
                <NewPartMediumView className="figure-img mb-0 mw-100" studentId={studentId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} partId={part.partId} newPartMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            ))}
            {part.newPartMedia.filter(m => m.type === 'download').map(m => {
              const href = `${endpoint}/students/${studentId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/media/${m.partMediumId}/file`;
              return (
                <div key={m.partMediumId} className="downloadMedium">
                  <a href={href} download>
                    <DownloadMedium medium={m} />
                  </a>
                </div>
              );
            })}
            {part.textBoxes.map(t => (
              <NewTextBoxForm key={t.textBoxId} textBox={t} save={saveText} update={updateText} />
            ))}
            {part.uploadSlots.map(u => (
              <NewUploadSlotForm key={u.uploadSlotId} uploadSlot={u} uploadFile={uploadFile} deleteFile={deleteFile} downloadFile={downloadFile} />
            ))}
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
    </section>
  );
});

NewPartForm.displayName = 'NewPartForm';

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
