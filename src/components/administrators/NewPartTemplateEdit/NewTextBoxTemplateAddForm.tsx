import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewTextBoxFormElements } from '../NewTextBoxTemplateEdit/NewTextBoxFormElements';
import type { State } from './state';
import type { TextBoxInsertPayload } from './useTextBoxInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  formState: State['newTextBoxTemplateForm'];
  insert$: Subject<TextBoxInsertPayload>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  linesChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxTemplateAddForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, formState, insert$, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newTextBoxTemplateForm']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      administratorId,
      schoolId,
      courseId,
      unitId,
      assignmentId,
      partId,
      processingState: formState.processingState,
      payload: {
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines ? parseInt(formState.data.lines, 10) : null,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <div id="newTextBoxCard" className="card">
      <div className="card-body">
        <h3 className="h5">New Text Box Template</h3>
        <form onSubmit={formSubmit}>
          <NewTextBoxFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            descriptionChange={descriptionChange}
            pointsChange={pointsChange}
            linesChange={linesChange}
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

NewTextBoxTemplateAddForm.displayName = 'NewTextBoxTemplateAddForm';
