import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartTemplateFormElements } from '../NewPartTemplateEdit/NewPartTemplateFormElements';
import type { State } from './state';
import type { NewPartTemplateInsertEvent } from './usePartInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  assignmentId: string;
  formState: State['newPartTemplateForm'];
  insert$: Subject<NewPartTemplateInsertEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onPartNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateAddForm: FC<Props> = memo(props => {
  const { administratorId, assignmentId, formState, insert$ } = props;

  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newPartTemplateForm']['validationMessages'];
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
    if (formState.data.descriptionType !== 'text' && formState.data.descriptionType !== 'html') {
      throw Error('Invalid description type');
    }
    insert$.next({
      administratorId,
      processingState: formState.processingState,
      payload: {
        assignmentId,
        partNumber: parseInt(formState.data.partNumber, 10),
        title: formState.data.title,
        description: formState.data.description.length === 0 ? null : formState.data.descriptionType === 'text' ? formState.data.description : formState.meta.sanitizedHtml,
        descriptionType: formState.data.descriptionType,
        markingCriteria: formState.data.markingCriteria || null,
      },
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Part Template</h3>
        <form onSubmit={handleFormSubmit}>
          <NewPartTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            onTitleChange={props.onTitleChange}
            onDescriptionChange={props.onDescriptionChange}
            onDescriptionTypeChange={props.onDescriptionTypeChange}
            onMarkingCriteriaChange={props.onMarkingCriteriaChange}
            onPartNumberChange={props.onPartNumberChange}
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

NewPartTemplateAddForm.displayName = 'NewPartTemplateAddForm';
