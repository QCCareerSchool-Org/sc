import type { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentTemplateFormElements } from './NewAssignmentTemplateFormElements';
import type { State } from './state';
import type { NewAssignmentTemplateDeleteEvent } from './useAssignmentDelete';
import type { NewAssignmentTemplateSaveEvent } from './useAssignmentSave';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentTemplateWithUnitAndParts } from '@/services/administrators/newAssignmentTemplateService';

type Props = {
  administratorId: number;
  assignmentId: string;
  assignmentTemplate: NewAssignmentTemplateWithUnitAndParts;
  formState: State['form'];
  save$: Subject<NewAssignmentTemplateSaveEvent>;
  delete$: Subject<NewAssignmentTemplateDeleteEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onAssignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateEditForm: FC<Props> = memo(props => {
  const { administratorId, assignmentId, assignmentTemplate, formState, save$, delete$ } = props;
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
      assignmentId,
      payload: {
        assignmentNumber: parseInt(formState.data.assignmentNumber, 10),
        title: formState.data.title || null,
        description: formState.data.description || null,
        descriptionType: formState.data.descriptionType,
        markingCriteria: formState.data.markingCriteria || null,
        optional: formState.data.optional,
      },
      processingState: formState.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this assignment template and all its media and parts?\n\nmedia:${assignmentTemplate?.newAssignmentMedia.length}\nparts: ${assignmentTemplate?.newPartTemplates.length}`)) {
      delete$.next({
        administratorId,
        assignmentId,
        processingState: formState.processingState,
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <NewAssignmentTemplateFormElements
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        onTitleChange={props.onTitleChange}
        onDescriptionChange={props.onDescriptionChange}
        onDescriptionTypeChange={props.onDescriptionTypeChange}
        onMarkingCriteriaChange={props.onMarkingCriteriaChange}
        onAssignmentNumberChange={props.onAssignmentNumberChange}
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

NewAssignmentTemplateEditForm.displayName = 'NewAssignmentTemplateEditForm';
