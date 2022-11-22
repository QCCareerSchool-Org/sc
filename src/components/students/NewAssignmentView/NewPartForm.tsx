import type { FC } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { NewPartMediumView } from './NewPartMediumView';
import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import type { TextBoxFunction, UploadSlotFunction } from '.';
import { Description } from '@/components/Description';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import type { PartState } from '@/components/students/NewAssignmentView/state';

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
  assignmentId: string;
  part: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const NewPartForm: FC<Props> = memo(props => {
  const { studentId, courseId, submissionId, assignmentId, part, saveText, updateText, uploadFile, deleteFile, downloadFile } = props;
  return (
    <Section id={part.partId}>
      <div className="container">
        <h2 className="h3"><span className="text-danger">{part.partNumber}.</span> {part.title}</h2>
        {part.description && <Description description={part.description} descriptionType={part.descriptionType} />}
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            {part.newPartMedia.filter(m => m.type !== 'download').map(m => (
              <figure key={m.partMediumId} className={`figure ${m.type}Figure`}>
                <NewPartMediumView className="figure-img mb-0 mw-100" studentId={studentId} courseId={courseId} submissionId={submissionId} assignmentId={assignmentId} partId={part.partId} newPartMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            ))}
            {part.newPartMedia.filter(m => m.type === 'download').map(m => {
              const href = `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${submissionId}/assignments/${assignmentId}/parts/${part.partId}/media/${m.partMediumId}/file`;
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
      .downloadMedium a {
        text-decoration: none;
        color: inherit;
      }
      `}</style>
    </Section>
  );
});

NewPartForm.displayName = 'NewPartForm';
