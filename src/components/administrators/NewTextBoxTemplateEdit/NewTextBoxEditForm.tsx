import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewTextBoxFormElements } from './NewTextBoxFormElements';
import type { State } from './state';
import type { NewTextBoxTemplateDeleteEvent } from './useTextBoxDelete';
import type { NewTextBoxTemplateSaveEvent } from './useTextBoxSave';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  textBoxId: string;
  formState: State['form'];
  save$: Subject<NewTextBoxTemplateSaveEvent>;
  delete$: Subject<NewTextBoxTemplateDeleteEvent>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onPointsChange: ChangeEventHandler<HTMLInputElement>;
  onLinesChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxEditForm = memo((props: Props): ReactElement => {
  const { administratorId, textBoxId, formState, save$, delete$ } = props;
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
      textBoxId,
      payload: {
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines === '' ? null : parseInt(formState.data.lines, 10),
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
        textBoxId,
        processingState: formState.processingState,
      });
    }
  };

  return (
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

NewTextBoxEditForm.displayName = 'NewTextBoxEditForm';
