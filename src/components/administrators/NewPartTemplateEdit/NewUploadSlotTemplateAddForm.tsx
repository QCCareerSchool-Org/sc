import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUploadSlotTemplateFormElements } from '../NewUploadSlotTemplateEdit/NewUploadSlotTemplateFormElements';
import type { State } from './state';
import type { NewUploadSlotTemplateInsertEvent } from './useUploadSlotInsert';
import { Spinner } from '@/components/Spinner';
import type { NewUploadSlotAllowedType } from '@/services/administrators/newUploadSlotTemplateService';

type Props = {
  administratorId: number;
  partId: string;
  formState: State['newUoloadSlotTemplateForm'];
  insert$: Subject<NewUploadSlotTemplateInsertEvent>;
  onLabelChange: ChangeEventHandler<HTMLInputElement>;
  onPointsChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onPdfChange: ChangeEventHandler<HTMLInputElement>;
  onWordChange: ChangeEventHandler<HTMLInputElement>;
  onExcelChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateAddForm = memo((props: Props): ReactElement => {
  const { administratorId, partId, formState, insert$ } = props;
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newUoloadSlotTemplateForm']['validationMessages'];
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
        label: formState.data.label,
        points: parseInt(formState.data.points, 10),
        allowedTypes: Object.keys(formState.data.allowedTypes).reduce<NewUploadSlotAllowedType[]>((prev, cur) => {
          const key = cur as NewUploadSlotAllowedType;
          if (formState.data.allowedTypes[key]) {
            prev.push(key);
          }
          return prev;
        }, []),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
      processingState: formState.processingState,
    });
  };

  return (
    <div id="newUploadSlotCard" className="card">
      <div className="card-body">
        <h3 className="h5">New Upload Slot Template</h3>
        <form onSubmit={handleFormSubmit}>
          <NewUploadSlotTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            onLabelChange={props.onLabelChange}
            onPointsChange={props.onPointsChange}
            onImageChange={props.onImageChange}
            onPdfChange={props.onPdfChange}
            onWordChange={props.onWordChange}
            onExcelChange={props.onExcelChange}
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

NewUploadSlotTemplateAddForm.displayName = 'NewUploadSlotTemplateAddForm';
