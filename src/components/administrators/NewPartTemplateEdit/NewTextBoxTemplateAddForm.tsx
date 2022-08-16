import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewTextBoxFormElements } from '../NewTextBoxTemplateEdit/NewTextBoxFormElements';
import type { State } from './state';
import type { NewTextBoxTemplateInsertEvent } from './useTextBoxInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  partId: string;
  formState: State['newTextBoxTemplateForm'];
  insert$: Subject<NewTextBoxTemplateInsertEvent>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onPointsChange: ChangeEventHandler<HTMLInputElement>;
  onLinesChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxTemplateAddForm: FC<Props> = memo(props => {
  const { administratorId, partId, formState, insert$ } = props;
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

  const handleFormSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      administratorId,
      payload: {
        partId,
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines ? parseInt(formState.data.lines, 10) : null,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
      processingState: formState.processingState,
    });
  };

  return (
    <div id="newTextBoxCard" className="card">
      <div className="card-body">
        <h3 className="h5">New Text Box Template</h3>
        <form onSubmit={handleFormSubmit}>
          <NewTextBoxFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            onDescriptionChange={props.onDescriptionChange}
            onPointsChange={props.onPointsChange}
            onLinesChange={props.onLinesChange}
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

NewTextBoxTemplateAddForm.displayName = 'NewTextBoxTemplateAddForm';
