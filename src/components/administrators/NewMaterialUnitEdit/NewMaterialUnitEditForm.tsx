import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo, useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { NewMaterialUnitSaveEvent } from './useMaterialUnitSave';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  materialUnitId: string;
  formState: State['form'];
  save$: Subject<NewMaterialUnitSaveEvent>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewMaterialUnitEditForm: FC<Props> = memo(props => {
  const { administratorId, materialUnitId, formState, save$ } = props;

  const id = useId();

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
      processingState: formState.processingState,
      administratorId,
      materialUnitId,
      payload: {
        unitLetter: formState.data.unitLetter,
        title: formState.data.title || null,
        order: parseInt(formState.data.order, 10),
      },
    });
  };

  return (

    <form onSubmit={handleFormSubmit}>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTitle'} className="form-label">Title</label>
        <input onChange={props.onTitleChange} value={formState.data.title} type="text" id={id + '_newMaterialTitle'} maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTitleHelp'} />
        <div id={id + '_newMaterialTitleHelp'} className="form-text">The title of this material</div>
        {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialUnitLetter'} className="form-label">Unit Letter <span className="text-danger">*</span></label>
        <input onChange={props.onUnitLetterChange} value={formState.data.unitLetter} type="text" id={id + '_newMaterialUnitLetter'} maxLength={1} className={`form-control ${formState.validationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby={id + '_newMaterialUnitLetterHelp'} required />
        <div id={id + '_newMaterialUnitLetterHelp'} className="form-text">The unit for this material</div>
        {formState.validationMessages.unitLetter && <div className="invalid-feedback">{formState.validationMessages.unitLetter}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={props.onOrderChange} value={formState.data.order} type="number" id={id + '_newMaterialOrder'} min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newMaterialOrderHelp'} />
        <div id={id + '_newMaterialOrderHelp'} className="form-text">The order in which the material should appear within its unit</div>
        {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
      </div>
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving'}>
          {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Add'}
        </button>
        {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
      </div>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </form>
  );
});

NewMaterialUnitEditForm.displayName = 'NewMaterialUnitEditForm';
