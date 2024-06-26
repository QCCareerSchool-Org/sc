import type { FC } from 'react';

import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';

type Props = {
  newTextBoxTemplate: NewTextBoxTemplate;
};

export const NewTextBoxTemplatePreview: FC<Props> = ({ newTextBoxTemplate }) => {
  return (
    <>
      <div className="formGroup">
        {newTextBoxTemplate.description && <label htmlFor={newTextBoxTemplate.textBoxTemplateId} className="form-label fw-bold">{newTextBoxTemplate.description}</label>}
        <textarea id={newTextBoxTemplate.textBoxTemplateId} className="form-control" rows={newTextBoxTemplate.lines ?? 3} />
      </div>

      <style jsx>{`
        .formGroup {
          margin-bottom: 1rem;
        }
        .formGroup:last-of-type {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};
