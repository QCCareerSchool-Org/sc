import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUploadSlotTemplateFormElements } from './NewUploadSlotTemplateFormElements';
import type { State } from './state';
import type { UploadSlotDeletePayload } from './useUploadSlotDelete';
import type { UploadSlotSavePayload } from './useUploadSlotSave';
import { Spinner } from '@/components/Spinner';
import type { NewUploadSlotAllowedType, NewUploadSlotTemplatePayload } from '@/services/administrators/newUploadSlotTemplateService';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  uploadSlotId: string;
  formState: State['form'];
  save$: Subject<UploadSlotSavePayload>;
  delete$: Subject<UploadSlotDeletePayload>;
  labelChange: ChangeEventHandler<HTMLInputElement>;
  imageChange: ChangeEventHandler<HTMLInputElement>;
  pdfChange: ChangeEventHandler<HTMLInputElement>;
  wordChange: ChangeEventHandler<HTMLInputElement>;
  excelChange: ChangeEventHandler<HTMLInputElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateEditForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, formState, save$, delete$, labelChange, imageChange, pdfChange, wordChange, excelChange, pointsChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
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
    save$.next({
      administratorId,
      schoolId,
      courseId,
      unitId,
      assignmentId,
      partId,
      uploadSlotId,
      processingState: formState.processingState,
      payload: {
        label: formState.data.label,
        allowedTypes: Object.keys(formState.data.allowedTypes).reduce<NewUploadSlotAllowedType[]>((prev, cur) => {
          const key = cur as NewUploadSlotAllowedType;
          if (formState.data.allowedTypes[key]) {
            prev.push(key);
          }
          return prev;
        }, []),
        points: parseInt(formState.data.points, 10),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.next({
        administratorId,
        schoolId,
        courseId,
        unitId,
        assignmentId,
        partId,
        uploadSlotId,
        processingState: formState.processingState,
      });
    }
  };

  return (
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
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewUploadSlotTemplateEditForm.displayName = 'NewUploadSlotTemplateEditForm';
