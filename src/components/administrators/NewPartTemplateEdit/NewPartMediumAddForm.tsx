import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartMediumFormElements } from '../NewPartMediumEdit/NewPartMediumFormElements';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewPartMediumAddPayload } from '@/services/administrators/newPartMediumService';

type Props = {
  formState: State['partMediaForm'];
  insert$: Subject<{ processingState: State['partMediaForm']['processingState']; payload: NewPartMediumAddPayload }>;
  dataSourceChange: (dataSource: 'file upload' | 'url') => void;
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  fileChange: ChangeEventHandler<HTMLInputElement>;
  externalDataChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartMediumAddForm = memo(({ formState, insert$, dataSourceChange, captionChange, orderChange, fileChange, externalDataChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['partMediaForm']['validationMessages'];
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
    let payload: NewPartMediumAddPayload | null = null;
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
      processingState: formState.processingState,
      payload,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Part Medium</h3>
        <form onSubmit={formSubmit}>
          <NewPartMediumFormElements
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

NewPartMediumAddForm.displayName = 'NewPartMediumAddForm';
