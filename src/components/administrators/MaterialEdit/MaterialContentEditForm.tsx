import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { MaterialContentReplaceEvent } from './useMaterialContentReplace';
import { Spinner } from '@/components/Spinner';
import type { Material } from '@/domain/material';

type Props = {
  administratorId: number;
  material: Material;
  formState: State['contentForm'];
  replace$: Subject<MaterialContentReplaceEvent>;
  onContentChange: ChangeEventHandler<HTMLInputElement>;
};

export const MaterialContentEditForm: FC<Props> = props => {
  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in props.formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(props.formState.validationMessages, key)) {
      const validationMessage = key as keyof State['contentForm']['validationMessages'];
      if (props.formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid || props.formState.data.content === null) {
      return;
    }
    props.replace$.next({
      administratorId: props.administratorId,
      materialId: props.material.materialId,
      content: props.formState.data.content,
      processingState: props.formState.processingState,
    });
  };

  const accept = props.material.type === 'lesson'
    ? [ 'application/zip' ]
    : [
      'image/jpeg',
      'image/png',
      'image/svg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

  return (
    <>
      <h2>Content</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="formGroup">
          <input key={props.formState.key} onChange={props.onContentChange} className={`form-control ${props.formState.validationMessages.content ? 'is-invalid' : ''}`} type="file" accept={accept.join(',')} id={id + '_materialImage'} aria-describedby={id + '_materialImageHelp'} />
          <div id={id + '_materialImageHelp'} className="form-text">Select a file from your computer to upload</div>
          {props.formState.validationMessages.content && <div className="invalid-feedback">{props.formState.validationMessages.content}</div>}
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2" style={{ width: 100 }} disabled={!valid || props.formState.data.content === null || props.formState.processingState === 'saving'}>
            {props.formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Replace'}
          </button>
          {props.formState.processingState === 'save error' && <span className="text-danger ms-2">{props.formState.errorMessage ? props.formState.errorMessage : 'Save Error'}</span>}
          {props.formState.processingState === 'success' && <span className="text-success ms-2">Replace succeeded</span>}
        </div>
      </form>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
