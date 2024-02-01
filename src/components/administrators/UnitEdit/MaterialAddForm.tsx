import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo, useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { NewMaterialInsertEvent } from './useMaterialInsert';
import { ProgressBar } from '@/components/ProgressBar';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  unitId: string;
  formState: State['materialForm'];
  insert$: Subject<NewMaterialInsertEvent>;
  onTypeChange: ChangeEventHandler<HTMLSelectElement>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onContentChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onExternalDataChange: ChangeEventHandler<HTMLInputElement>;
  onMinutesChange: ChangeEventHandler<HTMLInputElement>;
  onChaptersChange: ChangeEventHandler<HTMLInputElement>;
  onVideosChange: ChangeEventHandler<HTMLInputElement>;
  onKnowledgeChecksChange: ChangeEventHandler<HTMLInputElement>;
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

export const MaterialAddForm: FC<Props> = memo(props => {
  const { administratorId, unitId, formState, insert$ } = props;

  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['materialForm']['validationMessages'];
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
    if (formState.data.type === 'lesson' || formState.data.type === 'scorm2004' || formState.data.type === 'download') {
      if (formState.data.content === null) {
        throw Error('file is null');
      }
    }
    insert$.next({
      processingState: formState.processingState,
      administratorId,
      payload: {
        unitId,
        type: formState.data.type,
        title: formState.data.title,
        description: formState.data.description,
        order: parseInt(formState.data.order, 10),
        externalData: formState.data.externalData || null,
        lessonMeta: formState.data.lessonMeta === null ? null : {
          minutes: parseInt(formState.data.lessonMeta.minutes, 10),
          chapters: parseInt(formState.data.lessonMeta.chapters, 10),
          videos: parseInt(formState.data.lessonMeta.videos, 10),
          knowledgeChecks: parseInt(formState.data.lessonMeta.knowledgeChecks, 10),
        },
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

  if (formState.data.type === 'lesson' && formState.data.lessonMeta === null) {
    throw Error('lessonMeta is missing');
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5>New Material</h5>
        <form onSubmit={handleFormSubmit}>
          <div className="formGroup">
            <label htmlFor={id + '_materialType'} className="form-label">Type <span className="text-danger">*</span></label>
            <select onChange={props.onTypeChange} value={formState.data.type} id={id + '_materialType'} className={`form-select ${formState.validationMessages.type ? 'is-invalid' : ''}`} required>
              <option value="lesson">Lesson</option>
              <option value="video">Video</option>
              <option value="download">Download</option>
              <option value="assignment">Assignment Reminder</option>
            </select>
            {formState.validationMessages.type && <div className="invalid-feedback">{formState.validationMessages.type}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_materialTitle'} className="form-label">Title <span className="text-danger">*</span></label>
            <input onChange={props.onTitleChange} value={formState.data.title} type="text" id={id + '_materialTitle'} maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_materialTitleHelp'} required />
            <div id={id + '_materialTitleHelp'} className="form-text">The title of this material</div>
            {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_materialDescription'} className="form-label">Description <span className="text-danger">*</span></label>
            <textarea onChange={props.onDescriptionChange} value={formState.data.description} id={id + '_materialDescription'} rows={4} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_materialDescriptionHelp'} />
            <div id={id + '_materialDescriptionHelp'} className="form-text">The description for this material</div>
            {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
          </div>
          <div className="formGroup">
            <label htmlFor={id + '_materialOrder'} className="form-label">Order <span className="text-danger">*</span></label>
            <input onChange={props.onOrderChange} value={formState.data.order} type="number" id={id + '_materialOrder'} min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialOrderHelp'} />
            <div id={id + '_materialOrderHelp'} className="form-text">The order in which the material should appear within its unit</div>
            {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
          </div>
          {(formState.data.type === 'lesson' || formState.data.type === 'download') && (
            <div className="formGroup">
              <label htmlFor={id + '_materialContent'} className="form-label">Content <span className="text-danger">*</span></label>
              <input key={formState.contentKey} onChange={props.onContentChange} className={`form-control ${formState.validationMessages.content ? 'is-invalid' : ''}`} type="file" accept={allowedMimeTypes.join(',')} id={id + '_materialContent'} aria-describedby={id + '_materialContentHelp'} required />
              <div id={id + '_materialContentHelp'} className="form-text">Select a file from your computer to upload</div>
              {formState.validationMessages.content && <div className="invalid-feedback">{formState.validationMessages.content}</div>}
            </div>
          )}
          {formState.data.type === 'video' && (
            <div className="formGroup">
              <label htmlFor={id + '_materialExternalData'} className="form-label">External Data <span className="text-danger">*</span></label>
              <input onChange={props.onExternalDataChange} value={formState.data.externalData} className={`form-control ${formState.validationMessages.externalData ? 'is-invalid' : ''}`} type="text" id={id + '_materialExternalData'} aria-describedby={id + '_materialExternalDataHelp'} required />
              <div id={id + '_materialExternalDataHelp'} className="form-text">The external URL (e.g., &ldquo;http://example.com/color-video.mp4&rdquo;)</div>
              {formState.validationMessages.externalData && <div className="invalid-feedback">{formState.validationMessages.externalData}</div>}
            </div>
          )}
          <div className="formGroup">
            <label htmlFor={id + '_materialImage'} className="form-label">Image</label>
            <input key={formState.imageKey} onChange={props.onImageChange} className={`form-control ${formState.validationMessages.image ? 'is-invalid' : ''}`} type="file" accept="image/jpeg,image/png" id={id + '_materialImage'} aria-describedby={id + '_materialImageHelp'} />
            <div id={id + '_materialImageHelp'} className="form-text">Select a file from your computer to upload</div>
            {formState.validationMessages.image && <div className="invalid-feedback">{formState.validationMessages.image}</div>}
          </div>
          {formState.data.type === 'lesson' && formState.data.lessonMeta && (
            <div className="row">
              <div className="col-6">
                <div className="formGroup">
                  <label htmlFor={id + '_materialMinutes'} className="form-label">Minutes <span className="text-danger">*</span></label>
                  <input onChange={props.onMinutesChange} value={formState.data.lessonMeta.minutes} type="number" id={id + '_materialMinutes'} min={0} max={127} className={`form-control ${formState.validationMessages.minutes ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialMinutesHelp'} />
                  <div id={id + '_materialMinutesHelp'} className="form-text">How long this lesson should take to complete</div>
                  {formState.validationMessages.minutes && <div className="invalid-feedback">{formState.validationMessages.minutes}</div>}
                </div>
              </div>
              <div className="col-6">
                <div className="formGroup">
                  <label htmlFor={id + '_materialChapters'} className="form-label">Chapters <span className="text-danger">*</span></label>
                  <input onChange={props.onChaptersChange} value={formState.data.lessonMeta.chapters} type="number" id={id + '_materialChapters'} min={0} max={127} className={`form-control ${formState.validationMessages.chapters ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialChaptersHelp'} />
                  <div id={id + '_materialChaptersHelp'} className="form-text">How many chapters are in this lesson</div>
                  {formState.validationMessages.chapters && <div className="invalid-feedback">{formState.validationMessages.chapters}</div>}
                </div>
              </div>
              <div className="col-6">
                <div className="formGroup">
                  <label htmlFor={id + '_materialVideos'} className="form-label">Videos <span className="text-danger">*</span></label>
                  <input onChange={props.onVideosChange} value={formState.data.lessonMeta.videos} type="number" id={id + '_materialVideos'} min={0} max={127} className={`form-control ${formState.validationMessages.videos ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialVideosHelp'} />
                  <div id={id + '_materialVideosHelp'} className="form-text">How many videos are in this lesson</div>
                  {formState.validationMessages.videos && <div className="invalid-feedback">{formState.validationMessages.videos}</div>}
                </div>
              </div>
              <div className="col-6">
                <div className="formGroup">
                  <label htmlFor={id + '_materialKnowledgeChecks'} className="form-label">Knowledge Checks <span className="text-danger">*</span></label>
                  <input onChange={props.onKnowledgeChecksChange} value={formState.data.lessonMeta.knowledgeChecks} type="number" id={id + '_materialKnowledgeChecks'} min={0} max={127} className={`form-control ${formState.validationMessages.knowledgeChecks ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialKnowledgeChecksHelp'} />
                  <div id={id + '_materialKnowledgeChecksHelp'} className="form-text">How many knowledge checks are in this lesson</div>
                  {formState.validationMessages.knowledgeChecks && <div className="invalid-feedback">{formState.validationMessages.knowledgeChecks}</div>}
                </div>
              </div>
            </div>
          )}
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

MaterialAddForm.displayName = 'MaterialAddForm';
