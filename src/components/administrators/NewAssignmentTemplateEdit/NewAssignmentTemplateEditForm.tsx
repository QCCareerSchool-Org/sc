import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentTemplateFormElements } from './NewAssignmentTemplateFormElements';
import type { State } from './state';
import type { AssignmentDeletePayload } from './useAssignmentDelete';
import type { AssignmentSavePayload } from './useAssignmentSave';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentTemplateWithUnitAndParts } from '@/services/administrators/newAssignmentTemplateService';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  assignmentTemplate: NewAssignmentTemplateWithUnitAndParts;
  formState: State['form'];
  save$: Subject<AssignmentSavePayload>;
  delete$: Subject<AssignmentDeletePayload>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  markingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  assignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateEditForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, assignmentTemplate, formState, save$, delete$, titleChange, descriptionChange, markingCriteriaChange, assignmentNumberChange, optionalChange }: Props): ReactElement => {
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
      processingState: formState.processingState,
      payload: {
        assignmentNumber: parseInt(formState.data.assignmentNumber, 10),
        title: formState.data.title || null,
        description: formState.data.description || null,
        markingCriteria: formState.data.markingCriteria || null,
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this assignment template and all its media and parts?\n\nmedia:${assignmentTemplate?.newAssignmentMedia.length}\nparts: ${assignmentTemplate?.newPartTemplates.length}`)) {
      delete$.next({
        administratorId,
        schoolId,
        courseId,
        unitId,
        assignmentId,
        processingState: formState.processingState,
      });
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <NewAssignmentTemplateFormElements
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        titleChange={titleChange}
        descriptionChange={descriptionChange}
        markingCriteriaChange={markingCriteriaChange}
        assignmentNumberChange={assignmentNumberChange}
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

NewAssignmentTemplateEditForm.displayName = 'NewAssignmentTemplateEditForm';
