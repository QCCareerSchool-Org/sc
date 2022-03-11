import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUnitTemplateFormElements } from '../NewUnitTemplateEdit/NewUnitTemplateFormElements';
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
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Unit Template</h3>
        <form onSubmit={formSubmit}>
          <NewUnitTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            titleChange={titleChange}
            descriptionChange={descriptionChange}
            unitLetterChange={unitLetterChange}
            orderChange={orderChange}
            optionalChange={optionalChange}
          />
          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
              {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
            </button>
            {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
          </div>
        </form>
      </div>
    </div>
  );
});

NewUnitTemplateAddForm.displayName = 'NewUnitTemplateAddForm';
