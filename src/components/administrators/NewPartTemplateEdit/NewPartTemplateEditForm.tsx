import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
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
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  partTemplate: NewPartTemplateWithAssignmentAndInputs;
  formState: State['form'];
  save$: Subject<PartSavePayload>;
  delete$: Subject<PartDeletePayload>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  descriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  partNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateEditForm = memo(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, partTemplate, formState, save$, delete$, titleChange, descriptionChange, descriptionTypeChange, partNumberChange }: Props): ReactElement => {
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
    if (formState.data.descriptionType !== 'text' && formState.data.descriptionType !== 'html') {
      throw Error('Invalid description type');
    }
    save$.next({
      administratorId,
      schoolId,
      courseId,
      unitId,
      assignmentId,
      partId,
      processingState: formState.processingState,
      payload: {
        title: formState.data.title,
        description: formState.data.description.length === 0 ? null : formState.data.descriptionType === 'text' ? formState.data.description : formState.meta.sanitizedHtml,
        descriptionType: formState.data.descriptionType,
        partNumber: parseInt(formState.data.partNumber, 10),
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this part template and all its media and inputs?\n\nmedia: ${partTemplate.newPartMedia.length}\ntext boxes: ${partTemplate?.newTextBoxTemplates.length}\nupload slots: ${partTemplate?.newUploadSlotTemplates.length}`)) {
      delete$.next({
        administratorId,
        schoolId,
        courseId,
        unitId,
        assignmentId,
        partId,
        processingState: formState.processingState,
      });
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <NewPartTemplateFormElements
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        titleChange={titleChange}
        descriptionChange={descriptionChange}
        descriptionTypeChange={descriptionTypeChange}
        partNumberChange={partNumberChange}
      />
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
          {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
        {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
      </div>
    </form>
  );
});

NewPartTemplateEditForm.displayName = 'NewPartTemplateEditForm';
