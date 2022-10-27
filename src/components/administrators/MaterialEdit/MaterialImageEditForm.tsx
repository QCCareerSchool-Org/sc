import type { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler } from 'react';
import { useId } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { MaterialImageAddOrReplaceEvent } from './useMaterialImageAddOrReplace';
import type { MaterialImageDeleteEvent } from './useMaterialImageDelete';
import { Img } from '@/components/Img';
import { Spinner } from '@/components/Spinner';
import type { Material } from '@/domain/material';
import { endpoint } from 'src/basePath';

type Props = {
  administratorId: number;
  material: Material;
  formState: State['imageForm'];
  addOrReplace$: Subject<MaterialImageAddOrReplaceEvent>;
  delete$: Subject<MaterialImageDeleteEvent>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  imageVersion: string;
};

export const MaterialImageEditForm: FC<Props> = props => {
  const id = useId();

  let valid = true;
  // check if there are any validation messages
  for (const key in props.formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(props.formState.validationMessages, key)) {
      const validationMessage = key as keyof State['imageForm']['validationMessages'];
      if (props.formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid || props.formState.data.image === null) {
      return;
    }
    props.addOrReplace$.next({
      administratorId: props.administratorId,
      materialId: props.material.materialId,
      image: props.formState.data.image,
      processingState: props.formState.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    props.delete$.next({
      administratorId: props.administratorId,
      materialId: props.material.materialId,
      processingState: props.formState.processingState,
    });
  };

  const imageSrc = `${endpoint}/administrators/${props.administratorId}/materials/${props.material.materialId}/image?v=${props.imageVersion}`;

  return (
    <>
      <h2>Image</h2>
      <div className="formGroup">
        {props.material.imageMimeTypeId ?
          <Img src={imageSrc} className="img-fluid" alt="image" />
          : <>No image associated with this material</>
        }
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="formGroup">
          <input key={props.formState.key} onChange={props.onImageChange} className={`form-control ${props.formState.validationMessages.image ? 'is-invalid' : ''}`} type="file" accept="image/jpeg,image/png" id={id + '_materialImage'} aria-describedby={id + '_materialImageHelp'} />
          <div id={id + '_materialImageHelp'} className="form-text">Select a file from your computer to upload</div>
          {props.formState.validationMessages.image && <div className="invalid-feedback">{props.formState.validationMessages.image}</div>}
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2" style={{ width: 100 }} disabled={!valid || props.formState.data.image === null || props.formState.processingState === 'saving' || props.formState.processingState === 'deleting'}>
            {props.formState.processingState === 'saving' ? <Spinner size="sm" /> : props.material.imageMimeTypeId ? 'Replace' : 'Add'}
          </button>
          <button type="button" onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 100 }} disabled={props.material.imageMimeTypeId === null || props.formState.processingState === 'saving' || props.formState.processingState === 'deleting'}>
            {props.formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Remove'}
          </button>
          {props.formState.processingState === 'save error' && <span className="text-danger ms-2">{props.formState.errorMessage ? props.formState.errorMessage : 'Save Error'}</span>}
          {props.formState.processingState === 'delete error' && <span className="text-danger ms-2">{props.formState.errorMessage ? props.formState.errorMessage : 'Delete Error'}</span>}
        </div>
      </form>
      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
