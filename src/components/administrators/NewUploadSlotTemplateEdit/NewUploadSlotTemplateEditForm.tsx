import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewUploadSlotTemplateFormElements } from './NewUploadSlotTemplateFormElements';
import type { State } from './state';
import type { NewUploadSlotTemplateDeleteEvent } from './useUploadSlotDelete';
import type { NewUploadSlotTemplateSaveEvent } from './useUploadSlotSave';
import { Spinner } from '@/components/Spinner';
import type { NewUploadSlotAllowedType } from '@/services/administrators/newUploadSlotTemplateService';

type Props = {
  administratorId: number;
  uploadSlotId: string;
  formState: State['form'];
  save$: Subject<NewUploadSlotTemplateSaveEvent>;
  delete$: Subject<NewUploadSlotTemplateDeleteEvent>;
  onLabelChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onPdfChange: ChangeEventHandler<HTMLInputElement>;
  onWordChange: ChangeEventHandler<HTMLInputElement>;
  onExcelChange: ChangeEventHandler<HTMLInputElement>;
  onPointsChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateEditForm = memo((props: Props): ReactElement => {
  const { administratorId, uploadSlotId, formState, save$, delete$ } = props;
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

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    save$.next({
      administratorId,
      uploadSlotId,
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
      processingState: formState.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.next({
        administratorId,
        uploadSlotId,
        processingState: formState.processingState,
      });
    }
  };

  return (
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
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewUploadSlotTemplateEditForm.displayName = 'NewUploadSlotTemplateEditForm';
