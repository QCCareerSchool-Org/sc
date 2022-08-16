import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentMediumFormElements } from '../NewAssignmentMediumEdit/NewAssignmentMediumFormElements';
import type { State } from './state';
import type { NewAssignmentMediumInsertEvent } from './useMediumInsert';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentMediumAddPayload } from '@/services/administrators/newAssignmentMediumService';

type Props = {
  administratorId: number;
  assignmentId: string;
  formState: State['assignmentMediaForm'];
  insert$: Subject<NewAssignmentMediumInsertEvent>;
  onDataSourceChange: (dataSource: 'file upload' | 'url') => void;
  onCaptionChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onExternalDataChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentMediumAddForm: FC<Props> = memo(props => {
  const { administratorId, assignmentId, formState, insert$ } = props;
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['assignmentMediaForm']['validationMessages'];
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
    let payload: NewAssignmentMediumAddPayload | null = null;
    if (formState.data.dataSource === 'file upload' && formState.data.file) {
      payload = {
        assignmentId,
        sourceData: 'file upload',
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
        file: formState.data.file,
      };
    } else if (formState.data.dataSource === 'url' && formState.data.externalData) {
      payload = {
        assignmentId,
        sourceData: 'url',
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
        externalData: formState.data.externalData,
      };
    }
    if (payload === null) {
      throw Error('Invalid form data');
    }
    insert$.next({
      administratorId,
      payload,
      processingState: formState.processingState,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Assignment Medium</h3>
        <form onSubmit={handleFormSubmit}>
          <NewAssignmentMediumFormElements
            formType="add"
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            inserting={formState.processingState === 'inserting'}
            progress={formState.progress}
            onDataSourceChange={props.onDataSourceChange}
            onCaptionChange={props.onCaptionChange}
            onOrderChange={props.onOrderChange}
            onFileChange={props.onFileChange}
            onExternalDataChange={props.onExternalDataChange}
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

NewAssignmentMediumAddForm.displayName = 'NewAssignmentMediumAddForm';
