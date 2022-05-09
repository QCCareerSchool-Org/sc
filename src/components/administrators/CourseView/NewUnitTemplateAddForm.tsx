import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUnitTemplateFormElements } from '../NewUnitTemplateEdit/NewUnitTemplateFormElements';
import type { State } from './state';
import type { NewUnitTemplateInsertEvent } from './useUnitInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  courseId: number;
  formState: State['newUnitTemplateForm'];
  insert$: Subject<NewUnitTemplateInsertEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUnitTemplateAddForm = memo((props: Props): ReactElement => {
  const { administratorId, courseId, formState, insert$ } = props;

  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newUnitTemplateForm']['validationMessages'];
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
        courseId,
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

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Unit Template</h3>
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

NewUnitTemplateAddForm.displayName = 'NewUnitTemplateAddForm';
