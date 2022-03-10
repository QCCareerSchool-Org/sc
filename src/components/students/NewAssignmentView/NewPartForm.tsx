import type { ReactElement } from 'react';
import { memo } from 'react';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import type { TextBoxFunction, UploadSlotFunction } from '.';
import type { PartState } from '@/components/students/NewAssignmentView/state';
import type { NewDescriptionType } from '@/domain/newDescriptionType';

type Props = {
  part: PartState;
  saveText: TextBoxFunction;
  updateText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const NewPartForm = memo(({ part, saveText, updateText, uploadFile, deleteFile, downloadFile }: Props): ReactElement => (
  <section>
    <div className="container">
      <h2 className="h3">{part.title}</h2>
      {part.description && <Description description={part.description} descriptionType={part.descriptionType} />}
      <div className="row">
        <div className="col col-md-10 col-lg-8">
          {part.textBoxes.map(t => (
            <NewTextBoxForm
              key={t.textBoxId}
              textBox={t}
              save={saveText}
              update={updateText}
            />
          ))}
          {part.uploadSlots.map(u => (
            <NewUploadSlotForm
              key={u.uploadSlotId}
              uploadSlot={u}
              uploadFile={uploadFile}
              deleteFile={deleteFile}
              downloadFile={downloadFile}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
));

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
