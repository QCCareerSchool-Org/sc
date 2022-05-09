import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartMediumFormElements } from './NewPartMediumFormElements';
import type { State } from './state';
import type { NewPartMediumDeleteEvent } from './useMediumDelete';
import type { NewPartMediumSaveEvent } from './useMediumSave';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  mediumId: string;
  formState: State['form'];
  save$: Subject<NewPartMediumSaveEvent>;
  delete$: Subject<NewPartMediumDeleteEvent>;
  onCaptionChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartMediumEditForm = memo((props: Props): ReactElement => {
  const { administratorId, mediumId, formState, save$, delete$ } = props;
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

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    save$.next({
      administratorId,
      mediumId,
      payload: {
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
      },
      processingState: formState.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this part medium?`)) {
      delete$.next({
        administratorId,
        mediumId,
        processingState: formState.processingState,
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <NewPartMediumFormElements
        formType="edit"
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        onCaptionChange={props.onCaptionChange}
        onOrderChange={props.onOrderChange}
      />
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}          </div>
    </form>
  );
});

NewPartMediumEditForm.displayName = 'NewPartMediumEditForm';
