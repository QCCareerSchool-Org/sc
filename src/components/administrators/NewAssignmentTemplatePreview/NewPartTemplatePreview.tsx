import type { ReactElement } from 'react';

import { NewTextBoxTemplatePreview } from './NewTextBoxTemplatePreview';
import { NewUploadSlotTemplatePreview } from './NewUploadSlotTemplatePreview';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';

type NewPartTemplateWithInputs = NewPartTemplate & {
  newTextBoxTemplates: NewTextBoxTemplate[];
  newUploadSlotTemplates: NewUploadSlotTemplate[];
};

type Props = {
  newPartTemplate: NewPartTemplateWithInputs;
};

export const NewPartTemplatePreview = ({ newPartTemplate }: Props): ReactElement => {
  return (
    <section>
      <div className="container">
        <div className="col col-md-10 col-lg-8">
          {newPartTemplate.optional && <small className="text-danger">optional</small>}
          {newPartTemplate.description && <p className="fw-bold">{newPartTemplate.description}</p>}
          {newPartTemplate.newTextBoxTemplates.map(t => <NewTextBoxTemplatePreview key={t.textBoxTemplateId} newTextBoxTemplate={t} />)}
          {newPartTemplate.newUploadSlotTemplates.map(u => <NewUploadSlotTemplatePreview key={u.uploadSlotTemplateId} newUploadSlotTemplate={u} />)}
        </div>
      </div>
    </section>
  );
};
