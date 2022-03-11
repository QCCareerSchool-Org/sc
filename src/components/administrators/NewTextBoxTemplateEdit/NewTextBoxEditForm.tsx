import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewTextBoxFormElements } from './NewTextBoxFormElements';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewTextBoxTemplatePayload } from '@/services/administrators/newTextBoxTemplateService';

type Props = {
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewTextBoxTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  linesChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxEditForm = memo(({ formState, save$, delete$, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
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
      processingState: formState.processingState,
      payload: {
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines === '' ? null : parseInt(formState.data.lines, 10),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.next(formState.processingState);
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <NewTextBoxFormElements
        formData={formState.data}
        formValidationMessages={formState.validationMessages}
        descriptionChange={descriptionChange}
        pointsChange={pointsChange}
        linesChange={linesChange}
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

NewTextBoxEditForm.displayName = 'NewTextBoxEditForm';
