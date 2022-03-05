import { FormEventHandler, ReactElement } from 'react';
import { Subject } from 'rxjs';

import { State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewPartTemplatePayload } from '@/services/administrators/newPartTemplateService';

type Props = {
  formState: State['form'];
  insert$: Subject<NewPartTemplatePayload>;
  titleChange: FormEventHandler<HTMLInputElement>;
  descriptionChange: FormEventHandler<HTMLTextAreaElement>;
  partNumberChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewPartForm = ({ formState, insert$, titleChange, descriptionChange, partNumberChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      title: formState.data.title || null,
      description: formState.data.description || null,
      partNumber: parseInt(formState.data.partNumber, 10),
      optional: formState.data.optional,
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newPartTitle" className="form-label">Title</label>
              <input onChange={titleChange} value={formState.data.title} type="text" id="newPartTitle" maxLength={191} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newPartTitleHelp" />
              <div id="newPartTitleHelp" className="form-text">The title of this part (for internal use only)</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newPartDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newPartDescriptionHelp" />
              <div id="newPartDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartPartNumber" className="form-label">Part Number <span className="text-danger">*</span></label>
              <input onChange={partNumberChange} value={formState.data.partNumber} type="number" id="newPartPartNumber" min={1} max={127} className={`form-control ${formState.validationMessages.partNumber ? 'is-invalid' : ''}`} aria-describedby="newPartPartNumberHelp" required />
              <div id="newPartPartNumberHelp" className="form-text">The ordering for this part within an assignment</div>
              {formState.validationMessages.partNumber && <div className="invalid-feedback">{formState.validationMessages.partNumber}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newPartOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newPartOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.saveState === 'processing'}>Save</button>
              {formState.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {formState.saveState === 'error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};
