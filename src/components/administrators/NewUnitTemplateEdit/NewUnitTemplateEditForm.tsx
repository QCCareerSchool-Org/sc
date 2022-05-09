import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUnitTemplateFormElements } from './NewUnitTemplateFormElements';
import type { State } from './state';
import type { NewUnitTemplateDeleteEvent } from './useUnitDelete';
import type { NewUnitTemplateSaveEvent } from './useUnitSave';
import { Spinner } from '@/components/Spinner';
import type { NewUnitTemplateWithCourseAndAssignments } from '@/services/administrators/newUnitTemplateService';

type Props = {
  administratorId: number;
  unitId: string;
  unitTemplate: NewUnitTemplateWithCourseAndAssignments;
  formState: State['form'];
  save$: Subject<NewUnitTemplateSaveEvent>;
  delete$: Subject<NewUnitTemplateDeleteEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUnitTemplateEditForm = memo((props: Props): ReactElement => {
  const { administratorId, unitId, unitTemplate, formState, save$, delete$ } = props;
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
      unitId,
      payload: {
        unitLetter: formState.data.unitLetter,
        title: formState.data.title || null,
        description: formState.data.description || null,
        markingCriteria: formState.data.markingCriteria || null,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
      processingState: formState.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this unit template and all its assignments?\n\nassignments: ${unitTemplate?.newAssignmentTemplates.length}`)) {
      delete$.next({
        administratorId,
        unitId,
        processingState: formState.processingState,
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <NewUnitTemplateFormElements
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        onTitleChange={props.onTitleChange}
        onDescriptionChange={props.onDescriptionChange}
        onMarkingCriteriaChange={props.onMarkingCriteriaChange}
        onUnitLetterChange={props.onUnitLetterChange}
        onOrderChange={props.onOrderChange}
        onOptionalChange={props.onOptionalChange}
      />
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewUnitTemplateEditForm.displayName = 'NewUnitTemplateEditForm';
