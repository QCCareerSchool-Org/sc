import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo, useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { NewMaterialUnitInsertEvent } from './useMaterialUnitInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  courseId: number;
  formState: State['newMaterialUnitForm'];
  insert$: Subject<NewMaterialUnitInsertEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewMaterialUnitAddForm = memo((props: Props): ReactElement => {
  const { administratorId, courseId, formState, insert$ } = props;

  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newMaterialUnitForm']['validationMessages'];
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
    insert$.next({
      processingState: formState.processingState,
      administratorId,
      payload: {
        courseId,
        unitLetter: formState.data.unitLetter,
        title: formState.data.title || null,
        order: parseInt(formState.data.order, 10),
      },
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Material Unit</h3>
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
            <div id={id + '_newMaterialOrderHelp'} className="form-text">The order in which the unit should appear (typically, this can be set to zero for all units)</div>
            {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
          </div>
          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
              {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
            </button>
            {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
          </div>
        </form>
      </div>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </div>
  );
});

NewMaterialUnitAddForm.displayName = 'NewMaterialUnitAddForm';
