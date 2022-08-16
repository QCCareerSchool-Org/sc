import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentTemplateFormElements } from '../NewAssignmentTemplateEdit/NewAssignmentTemplateFormElements';
import type { State } from './state';
import type { NewAssignementTemplateInsertEvent } from './useAssignmentInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  unitId: string;
  formState: State['newAssignmentTemplateForm'];
  insert$: Subject<NewAssignementTemplateInsertEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onAssignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateAddForm: FC<Props> = memo(props => {
  const { administratorId, unitId, formState, insert$ } = props;
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

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      administratorId,
      payload: {
        unitId,
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

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Assignment Template</h3>
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
