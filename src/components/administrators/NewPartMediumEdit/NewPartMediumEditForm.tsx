import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartMediumFormElements } from './NewPartMediumFormElements';
import type { State } from './state';
import type { MediumDeletePayload } from './useMediumDelete';
import type { MediumSavePayload } from './useMediumSave';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  mediumId: string;
  formState: State['form'];
  save$: Subject<MediumSavePayload>;
  delete$: Subject<MediumDeletePayload>;
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartMediumEditForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId, formState, save$, delete$, captionChange, orderChange }: Props): ReactElement => {
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
      administratorId,
      schoolId,
      courseId,
      unitId,
      assignmentId,
      partId,
      mediumId,
      processingState: formState.processingState,
      payload: {
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this part medium?`)) {
      delete$.next({
        administratorId,
        schoolId,
        courseId,
        unitId,
        assignmentId,
        partId,
        mediumId,
        processingState: formState.processingState,
      });
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
