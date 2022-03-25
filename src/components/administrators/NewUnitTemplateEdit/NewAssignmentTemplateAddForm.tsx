import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentTemplateFormElements } from '../NewAssignmentTemplateEdit/NewAssignmentTemplateFormElements';
import type { State } from './state';
import type { AssignementInsertPayload } from './useAssignmentInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  formState: State['newAssignmentTemplateForm'];
  insert$: Subject<AssignementInsertPayload>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  assignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateAddForm = memo(({ administratorId, schoolId, courseId, unitId, formState, insert$, titleChange, descriptionChange, assignmentNumberChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newAssignmentTemplateForm']['validationMessages'];
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
      administratorId,
      schoolId,
      courseId,
      unitId,
      processingState: formState.processingState,
      payload: {
        title: formState.data.title || null,
        description: formState.data.description || null,
        assignmentNumber: parseInt(formState.data.assignmentNumber, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Assignment Template</h3>
        <form onSubmit={formSubmit}>
          <NewAssignmentTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            titleChange={titleChange}
            descriptionChange={descriptionChange}
            assignmentNumberChange={assignmentNumberChange}
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

NewAssignmentTemplateAddForm.displayName = 'NewAssignmentTemplateAddForm';
