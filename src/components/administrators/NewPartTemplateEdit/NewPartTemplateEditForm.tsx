import type { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartTemplateFormElements } from './NewPartTemplateFormElements';
import type { State } from './state';
import type { PartDeletePayload } from './usePartDelete';
import type { PartSavePayload } from './usePartSave';
import { Spinner } from '@/components/Spinner';
import type { NewPartTemplateWithAssignmentAndInputs } from '@/services/administrators/newPartTemplateService';

type Props = {
  administratorId: number;
  partId: string;
  partTemplate: NewPartTemplateWithAssignmentAndInputs;
  formState: State['form'];
  save$: Subject<PartSavePayload>;
  delete$: Subject<PartDeletePayload>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onPartNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateEditForm: FC<Props> = memo(props => {
  const { administratorId, partId, partTemplate, formState, save$, delete$ } = props;

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
    if (formState.data.descriptionType !== 'text' && formState.data.descriptionType !== 'html') {
      throw Error('Invalid description type');
    }
    save$.next({
      administratorId,
      partId,
      processingState: formState.processingState,
      payload: {
        partNumber: parseInt(formState.data.partNumber, 10),
        title: formState.data.title,
        description: formState.data.description.length === 0 ? null : formState.data.descriptionType === 'text' ? formState.data.description : formState.meta.sanitizedHtml,
        descriptionType: formState.data.descriptionType,
        markingCriteria: formState.data.markingCriteria || null,
      },
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this part template and all its media and inputs?\n\nmedia: ${partTemplate.newPartMedia.length}\ntext boxes: ${partTemplate?.newTextBoxTemplates.length}\nupload slots: ${partTemplate?.newUploadSlotTemplates.length}`)) {
      delete$.next({
        administratorId,
        partId,
        processingState: formState.processingState,
      });
    }
  };

  return (
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
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewPartTemplateEditForm.displayName = 'NewPartTemplateEditForm';
