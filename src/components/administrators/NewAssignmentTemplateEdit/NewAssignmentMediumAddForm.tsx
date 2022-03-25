import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewAssignmentMediumFormElements } from '../NewAssignmentMediumEdit/NewAssignmentMediumFormElements';
import type { State } from './state';
import type { MediumInsertPayload } from './useMediumInsert';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentMediumAddPayload } from '@/services/administrators/newAssignmentMediumService';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  formState: State['assignmentMediaForm'];
  insert$: Subject<MediumInsertPayload>;
  dataSourceChange: (dataSource: 'file upload' | 'url') => void;
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  fileChange: ChangeEventHandler<HTMLInputElement>;
  externalDataChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentMediumAddForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, formState, insert$, dataSourceChange, captionChange, orderChange, fileChange, externalDataChange }: Props): ReactElement => {
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

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    let payload: NewAssignmentMediumAddPayload | null = null;
    if (formState.data.dataSource === 'file upload' && formState.data.file) {
      payload = {
        sourceData: 'file upload',
        caption: formState.data.caption,
        order: parseInt(formState.data.order, 10),
        file: formState.data.file,
      };
    } else if (formState.data.dataSource === 'url' && formState.data.externalData) {
      payload = {
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
      schoolId,
      courseId,
      unitId,
      assignmentId,
      processingState: formState.processingState,
      payload,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Assignment Medium</h3>
        <form onSubmit={formSubmit}>
          <NewAssignmentMediumFormElements
            formType="add"
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            inserting={formState.processingState === 'inserting'}
            progress={formState.progress}
            dataSourceChange={dataSourceChange}
            captionChange={captionChange}
            orderChange={orderChange}
            fileChange={fileChange}
            externalDataChange={externalDataChange}
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
