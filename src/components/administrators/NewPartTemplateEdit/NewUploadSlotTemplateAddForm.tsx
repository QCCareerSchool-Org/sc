import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUploadSlotTemplateFormElements } from '../NewUploadSlotTemplateEdit/NewUploadSlotTemplateFormElements';
import type { State } from './state';
import type { UploadSlotInsertPayload } from './useUploadSlotInsert';
import { Spinner } from '@/components/Spinner';
import type { NewUploadSlotAllowedType } from '@/services/administrators/newUploadSlotTemplateService';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  formState: State['newUoloadSlotTemplateForm'];
  insert$: Subject<UploadSlotInsertPayload>;
  labelChange: ChangeEventHandler<HTMLInputElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  imageChange: ChangeEventHandler<HTMLInputElement>;
  pdfChange: ChangeEventHandler<HTMLInputElement>;
  wordChange: ChangeEventHandler<HTMLInputElement>;
  excelChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateAddForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, formState, insert$, labelChange, pointsChange, orderChange, imageChange, pdfChange, wordChange, excelChange, optionalChange }: Props): ReactElement => {
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
    });
  };

  return (
    <div id="newUploadSlotCard" className="card">
      <div className="card-body">
        <h3 className="h5">New Upload Slot Template</h3>
        <form onSubmit={formSubmit}>
          <NewUploadSlotTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            labelChange={labelChange}
            pointsChange={pointsChange}
            imageChange={imageChange}
            pdfChange={pdfChange}
            wordChange={wordChange}
            excelChange={excelChange}
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

NewUploadSlotTemplateAddForm.displayName = 'NewUploadSlotTemplateAddForm';
