import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewUnitTemplatePayload } from '@/services/administrators/newUnitTemplateService';

type Props = {
  formState: State['newUnitTemplateForm'];
  insert$: Subject<{ processingState: State['newUnitTemplateForm']['processingState']; payload: NewUnitTemplatePayload }>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  unitLetterChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUnitTemplateAddForm = memo(({ formState, insert$, titleChange, descriptionChange, unitLetterChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newUnitTemplateForm']['validationMessages'];
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
      processingState: formState.processingState,
      payload: {
        title: formState.data.title || null,
        description: formState.data.description || null,
        unitLetter: formState.data.unitLetter,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="h5">New Unit Template</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newUnitTemplateTitle" className="form-label">Title</label>
              <input onChange={titleChange} value={formState.data.title} type="text" id="newUnitTemplateTitle" maxLength={191} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newUnitTemplateTitleHelp" />
              <div id="newUnitTemplateTitleHelp" className="form-text">The title of this unit</div>
              {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUnitTemplateDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newUnitTemplateDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newUnitTemplateDescriptionHelp" />
              <div id="newUnitTemplateDescriptionHelp" className="form-text">The description of this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUnitTemplateUnitLetter" className="form-label">Unit Letter <span className="text-danger">*</span></label>
              <input onChange={unitLetterChange} value={formState.data.unitLetter} type="text" id="newUnitTemplateUnitLetter" maxLength={1} className={`form-control ${formState.validationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby="newUnitTemplateUnitLetterHelp" required />
              <div id="newUnitTemplateUnitLetterHelp" className="form-text">The letter for this unit (must be unique)</div>
              {formState.validationMessages.unitLetter && <div className="invalid-feedback">{formState.validationMessages.unitLetter}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUnitOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newUnitOrder" min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby="newUnitOrderHelp" />
              <div id="newUnitOrderHelp" className="form-text">The order in which the unit should appear within its course</div>
              {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newUnitTemplateOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newUnitTemplateOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
                {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
              </button>
              {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
        .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
});

NewUnitTemplateAddForm.displayName = 'NewUnitTemplateAddForm';
