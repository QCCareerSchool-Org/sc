import type { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler } from 'react';
import { useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { MaterialDeleteEvent } from './useMaterialDelete';
import type { MaterialDetailsSaveEvent } from './useMaterialDetailsSave';
import { Spinner } from '@/components/Spinner';
import type { Material } from '@/domain/material';

type Props = {
  administratorId: number;
  material: Material;
  formState: State['detailsForm'];
  save$: Subject<MaterialDetailsSaveEvent>;
  delete$: Subject<MaterialDeleteEvent>;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onMinutesChange: ChangeEventHandler<HTMLInputElement>;
  onChaptersChange: ChangeEventHandler<HTMLInputElement>;
  onVideosChange: ChangeEventHandler<HTMLInputElement>;
  onKnowledgeChecksChange: ChangeEventHandler<HTMLInputElement>;
};

export const MaterialDetailsEditForm: FC<Props> = props => {
  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in props.formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(props.formState.validationMessages, key)) {
      const validationMessage = key as keyof State['detailsForm']['validationMessages'];
      if (props.formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    props.save$.next({
      processingState: props.formState.processingState,
      administratorId: props.administratorId,
      materialId: props.material.materialId,
      payload: {
        title: props.formState.data.title,
        description: props.formState.data.description,
        order: parseInt(props.formState.data.order, 10),
        lessonMeta: props.formState.data.lessonMeta === null ? null : {
          minutes: parseInt(props.formState.data.lessonMeta.minutes, 10),
          chapters: parseInt(props.formState.data.lessonMeta.chapters, 10),
          videos: parseInt(props.formState.data.lessonMeta.videos, 10),
          knowledgeChecks: parseInt(props.formState.data.lessonMeta.knowledgeChecks, 10),
        },
      },
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    props.delete$.next({
      processingState: props.formState.processingState,
      administratorId: props.administratorId,
      materialId: props.material.materialId,
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTemplateTitle'} className="form-label">Title <span className="text-danger">*</span></label>
        <input onChange={props.onTitleChange} value={props.formState.data.title} type="text" id={id + '_newMaterialTemplateTitle'} maxLength={191} className={`form-control ${props.formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTemplateTitleHelp'} />
        <div id={id + '_newMaterialTemplateTitleHelp'} className="form-text">The title of this material</div>
        {props.formState.validationMessages.title && <div className="invalid-feedback">{props.formState.validationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTemplateDescription'} className="form-label">Description <span className="text-danger">*</span></label>
        <textarea onChange={props.onDescriptionChange} value={props.formState.data.description} id={id + '_newMaterialTemplateDescription'} rows={4} className={`form-control ${props.formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTemplateDescriptionHelp'} />
        <div id={id + '_newMaterialTemplateDescriptionHelp'} className="form-text">The description for this material</div>
        {props.formState.validationMessages.description && <div className="invalid-feedback">{props.formState.validationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={props.onOrderChange} value={props.formState.data.order} type="number" id={id + '_newMaterialOrder'} min={0} max={127} className={`form-control ${props.formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newMaterialOrderHelp'} />
        <div id={id + '_newMaterialOrderHelp'} className="form-text">The order in which the material should appear within its unit</div>
        {props.formState.validationMessages.order && <div className="invalid-feedback">{props.formState.validationMessages.order}</div>}
      </div>
      {(props.material.type === 'lesson' || props.material.type === 'scorm2004') && props.formState.data.lessonMeta && (
        <div className="row">
          <div className="col-6">
            <div className="formGroup">
              <label htmlFor={id + '_materialMinutes'} className="form-label">Minutes <span className="text-danger">*</span></label>
              <input onChange={props.onMinutesChange} value={props.formState.data.lessonMeta.minutes} type="number" id={id + '_materialMinutes'} min={0} max={127} className={`form-control ${props.formState.validationMessages.minutes ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialMinutesHelp'} />
              <div id={id + '_materialMinutesHelp'} className="form-text">How long this lesson should take to complete</div>
              {props.formState.validationMessages.minutes && <div className="invalid-feedback">{props.formState.validationMessages.minutes}</div>}
            </div>
          </div>
          <div className="col-6">
            <div className="formGroup">
              <label htmlFor={id + '_materialChapters'} className="form-label">Chapters <span className="text-danger">*</span></label>
              <input onChange={props.onChaptersChange} value={props.formState.data.lessonMeta.chapters} type="number" id={id + '_materialChapters'} min={0} max={127} className={`form-control ${props.formState.validationMessages.chapters ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialChaptersHelp'} />
              <div id={id + '_materialChaptersHelp'} className="form-text">How many chapters are in this lesson</div>
              {props.formState.validationMessages.chapters && <div className="invalid-feedback">{props.formState.validationMessages.chapters}</div>}
            </div>
          </div>
          <div className="col-6">
            <div className="formGroup">
              <label htmlFor={id + '_materialVideos'} className="form-label">Videos <span className="text-danger">*</span></label>
              <input onChange={props.onVideosChange} value={props.formState.data.lessonMeta.videos} type="number" id={id + '_materialVideos'} min={0} max={127} className={`form-control ${props.formState.validationMessages.videos ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialVideosHelp'} />
              <div id={id + '_materialVideosHelp'} className="form-text">How many videos are in this lesson</div>
              {props.formState.validationMessages.videos && <div className="invalid-feedback">{props.formState.validationMessages.videos}</div>}
            </div>
          </div>
          <div className="col-6">
            <div className="formGroup">
              <label htmlFor={id + '_materialKnowledgeChecks'} className="form-label">Knowledge Checks <span className="text-danger">*</span></label>
              <input onChange={props.onKnowledgeChecksChange} value={props.formState.data.lessonMeta.knowledgeChecks} type="number" id={id + '_materialKnowledgeChecks'} min={0} max={127} className={`form-control ${props.formState.validationMessages.knowledgeChecks ? 'is-invalid' : ''}`} required aria-describedby={id + '_materialKnowledgeChecksHelp'} />
              <div id={id + '_materialKnowledgeChecksHelp'} className="form-text">How many knowledge checks are in this lesson</div>
              {props.formState.validationMessages.knowledgeChecks && <div className="invalid-feedback">{props.formState.validationMessages.knowledgeChecks}</div>}
            </div>
          </div>
        </div>
      )}
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || props.formState.processingState === 'saving'}>
          {props.formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
        </button>
        <button type="button" onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={props.formState.processingState === 'saving' || props.formState.processingState === 'deleting'}>
          {props.formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {props.formState.processingState === 'save error' && <span className="text-danger ms-2">{props.formState.errorMessage ? props.formState.errorMessage : 'Save Error'}</span>}
        {props.formState.processingState === 'delete error' && <span className="text-danger ms-2">{props.formState.errorMessage ? props.formState.errorMessage : 'Delete Error'}</span>}
        {props.formState.processingState === 'success' && <span className="text-success ms-2">Saved</span>}
      </div>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </form>
  );
};
