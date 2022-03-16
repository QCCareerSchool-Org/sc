import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartMediumFormElements } from './NewPartMediumFormElements';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewPartMediumEditPayload } from '@/services/administrators/newPartMediumService';

type Props = {
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewPartMediumEditPayload }>;
  delete$: Subject<State['form']['processingState']>;
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartMediumEditForm = memo(({ formState, save$, delete$, captionChange, orderChange }: Props): ReactElement => {
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
    save$.next({
      processingState: formState.processingState,
      payload: {
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this part medium?`)) {
      delete$.next(formState.processingState);
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <NewPartMediumFormElements
        formType="edit"
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        captionChange={captionChange}
        orderChange={orderChange}
      />
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}          </div>
    </form>
  );
});

NewPartMediumEditForm.displayName = 'NewPartMediumEditForm';
