import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo, useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { NewMaterialInsertEvent } from './useMaterialInsert';
import { ProgressBar } from '@/components/ProgressBar';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  materialUnitId: string;
  formState: State['newMaterialForm'];
  insert$: Subject<NewMaterialInsertEvent>;
  onTypeChange: ChangeEventHandler<HTMLSelectElement>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onContentChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onExternalDataChange: ChangeEventHandler<HTMLInputElement>;
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

export const NewMaterialAddForm = memo((props: Props): ReactElement => {
  const { administratorId, materialUnitId, formState, insert$ } = props;

  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newMaterialForm']['validationMessages'];
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
    if (formState.data.type === 'lesson' || formState.data.type === 'download') {
      if (formState.data.content === null) {
        throw Error('file is null');
      }
    }
    insert$.next({
      processingState: formState.processingState,
      administratorId,
      payload: {
        materialUnitId,
        type: formState.data.type,
        title: formState.data.title,
        description: formState.data.description,
        order: parseInt(formState.data.order, 10),
        externalData: formState.data.externalData || null,
      },
      content: formState.data.content,
      image: formState.data.image,
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
        <h5>New Material</h5>
        <form onSubmit={handleFormSubmit}>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialType'} className="form-label">Type <span className="text-danger">*</span></label>
            <select onChange={props.onTypeChange} value={formState.data.type} id={id + '_newMaterialType'} className={`form-select ${formState.validationMessages.type ? 'is-invalid' : ''}`} required>
              <option value="lesson">Lesson</option>
              <option value="video">Video</option>
              <option value="download">Download</option>
              <option value="assignment">Assignment Reminder</option>
            </select>
            {formState.validationMessages.type && <div className="invalid-feedback">{formState.validationMessages.type}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialTitle'} className="form-label">Title <span className="text-danger">*</span></label>
            <input onChange={props.onTitleChange} value={formState.data.title} type="text" id={id + '_newMaterialTitle'} maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTitleHelp'} required />
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
          {(formState.data.type === 'lesson' || formState.data.type === 'download') && (
            <div className="formGroup">
              <label htmlFor={id + '_newMaterialContent'} className="form-label">Content <span className="text-danger">*</span></label>
              <input key={formState.contentKey} onChange={props.onContentChange} className={`form-control ${formState.validationMessages.content ? 'is-invalid' : ''}`} type="file" accept={allowedMimeTypes.join(',')} id={id + '_newMaterialContent'} aria-describedby={id + '_newMaterialContentHelp'} required />
              <div id={id + '_newMaterialContentHelp'} className="form-text">Select a file from your computer to upload</div>
              {formState.validationMessages.content && <div className="invalid-feedback">{formState.validationMessages.content}</div>}
            </div>
          )}
          {formState.data.type === 'video' && (
            <div className="formGroup">
              <label htmlFor={id + '_newMaterialExternalData'} className="form-label">External Data <span className="text-danger">*</span></label>
              <input onChange={props.onExternalDataChange} value={formState.data.externalData} className={`form-control ${formState.validationMessages.externalData ? 'is-invalid' : ''}`} type="text" id={id + '_newMaterialExternalData'} aria-describedby={id + '_newMaterialExternalDataHelp'} required />
              <div id={id + '_newMaterialExternalDataHelp'} className="form-text">The external URL (e.g., &ldquo;http://example.com/color-video.mp4&rdquo;)</div>
              {formState.validationMessages.externalData && <div className="invalid-feedback">{formState.validationMessages.externalData}</div>}
            </div>
          )}
          <div className="formGroup">
            <label htmlFor={id + '_newMaterialImage'} className="form-label">Image</label>
            <input key={formState.imageKey} onChange={props.onImageChange} className={`form-control ${formState.validationMessages.image ? 'is-invalid' : ''}`} type="file" accept="image/jpeg,image/png" id={id + '_newMaterialImage'} aria-describedby={id + '_newMaterialImageHelp'} />
            <div id={id + '_newMaterialImageHelp'} className="form-text">Select a file from your computer to upload</div>
            {formState.validationMessages.image && <div className="invalid-feedback">{formState.validationMessages.image}</div>}
          </div>
          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
              {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
            </button>
            {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
          </div>
          {formState.processingState === 'inserting' && <div className="mt-4"><ProgressBar progress={formState.progress}>{formState.progress.toFixed(0)}%</ProgressBar></div>}
        </form>
      </div>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </div>
  );
});

NewMaterialAddForm.displayName = 'NewMaterialAddForm';
