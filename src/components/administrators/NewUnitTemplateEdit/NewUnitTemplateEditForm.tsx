import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUnitTemplateFormElements } from './NewUnitTemplateFormElements';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewUnitTemplatePayload, NewUnitTemplateWithCourseAndAssignments } from '@/services/administrators/newUnitTemplateService';

type Props = {
  unitTemplate: NewUnitTemplateWithCourseAndAssignments;
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewUnitTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  unitLetterChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUnitTemplateEditForm = memo(({ unitTemplate, formState, save$, delete$, titleChange, descriptionChange, unitLetterChange, orderChange, optionalChange }: Props): ReactElement => {
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
        title: formState.data.title || null,
        description: formState.data.description || null,
        unitLetter: formState.data.unitLetter,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this unit template and all its assignments?\n\nassignments: ${unitTemplate?.newAssignmentTemplates.length}`)) {
      delete$.next(formState.processingState);
    }
  };

  return (
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
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewUnitTemplateEditForm.displayName = 'NewUnitTemplateEditForm';
