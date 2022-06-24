import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo, useRef } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { NewMaterialInsertEvent } from './useMaterialInsert';
import { ProgressBar } from '@/components/ProgressBar';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  materialUnitId: string;
  formState: State['form'];
  insert$: Subject<NewMaterialInsertEvent>;
  onTypeChange: ChangeEventHandler<HTMLSelectElement>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
};

const defaultMimeTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/x-zip-compressed',
];

export const NewMaterialEditForm = memo((props: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2)).current;
  const { administratorId, materialUnitId, formState, insert$ } = props;

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
    if (formState.data.file === null) {
      throw Error('file is null');
    }
    insert$.next({
      processingState: formState.processingState,
      administratorId,
      materialUnitId,
      payload: {
        type: 'lesson',
        title: formState.data.title,
        description: formState.data.description,
        order: parseInt(formState.data.order, 10),
        externalData: formState.data.externalData || null,
      },
      file: formState.data.file,
    });
  };

  const allowedMimeTypes: string[] = formState.data.type === 'lesson'
    ? [ 'application/zip' ]
    : formState.data.type === 'download'
      ? defaultMimeTypes
      : [];

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Material</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialType'} className="form-label">Type <span className="text-danger">*</span></label>
            <select onChange={props.onTypeChange} value={formState.data.type} id={id + '_newMaterialType'} className={`form-select ${formState.validationMessages.type ? 'is-invalid' : ''}`}>
              <option value="lesson">Lesson</option>
              <option value="video">Video</option>
              <option value="download">Download</option>
              <option value="assignment">Assignment</option>
            </select>
            {formState.validationMessages.type && <div className="invalid-feedback">{formState.validationMessages.type}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialTitle'} className="form-label">Title <span className="text-danger">*</span></label>
            <input onChange={props.onTitleChange} value={formState.data.title} type="text" id={id + '_newMaterialTitle'} maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTitleHelp'} />
            <div id={id + '_newMaterialTitleHelp'} className="form-text">The title of this material</div>
            {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialDescription'} className="form-label">Description <span className="text-danger">*</span></label>
            <textarea onChange={props.onDescriptionChange} value={formState.data.description} id={id + '_newMaterialDescription'} rows={4} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialDescriptionHelp'} />
            <div id={id + '_newMaterialDescriptionHelp'} className="form-text">The description for this material <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
            {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialOrder'} className="form-label">Order <span className="text-danger">*</span></label>
            <input onChange={props.onOrderChange} value={formState.data.order} type="number" id={id + '_newMaterialOrder'} min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newMaterialOrderHelp'} />
            <div id={id + '_newMaterialOrderHelp'} className="form-text">The order in which the material should appear within its unit</div>
            {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
          </div>
          {formState.data.type === 'lesson' && (
            <div className="formGroup">
              <label htmlFor={id + '_newMaterialFile1'} className="form-label">File <span className="text-danger">*</span></label>
              {formState.processingState === 'inserting' && <ProgressBar progress={0}>{(0).toFixed(0)}%</ProgressBar>}
              <div className={formState.processingState === 'inserting' ? 'd-none' : ''}>
                <input onChange={props.onFileChange} className={`form-control ${formState.validationMessages.file ? 'is-invalid' : ''}`} type="file" accept={allowedMimeTypes.join(',')} id={id + '_newMaterialFile1'} aria-describedby={id + '_newMaterialFile1Help'} required />
                <div id={id + '_newMaterialFile1Help'} className="form-text">Select a file from your computer to upload</div>
                {formState.validationMessages.file && <div className="invalid-feedback">{formState.validationMessages.file}</div>}
              </div>
            </div>
          )}
          {formState.data.type === 'download' && (
            <div className="formGroup">
              <label htmlFor={id + '_newMaterialFile2'} className="form-label">File <span className="text-danger">*</span></label>
              {formState.processingState === 'inserting'
                ? <ProgressBar progress={0}>{(0).toFixed(0)}%</ProgressBar>
                : (
                  <>
                    <input onChange={props.onFileChange} className={`form-control ${formState.validationMessages.file ? 'is-invalid' : ''}`} type="file" accept={allowedMimeTypes.join(',')} id={id + '_newMaterialFile2'} aria-describedby={id + '_newMaterialFile2Help'} required />
                    <div id={id + '_newMaterialFile2Help'} className="form-text">Select a file from your computer to upload</div>
                  </>
                )
              }
              {formState.validationMessages.file && <div className="invalid-feedback">{formState.validationMessages.file}</div>}
            </div>
          )}
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

NewMaterialEditForm.displayName = 'NewMaterialEditForm';
