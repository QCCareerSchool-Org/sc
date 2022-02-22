import { MouseEventHandler, ReactElement, ReactEventHandler } from 'react';

import { UploadSlotFunction } from '.';
import { ProgressBar } from '@/components/ProgressBar';
import { UploadSlotState } from '@/components/students/NewAssignmentForm/state';
import { NewUploadSlot } from '@/domain/students';

type Props = {
  uploadSlot: NewUploadSlot;
  state: UploadSlotState;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
};

export const NewUploadSlotForm = ({ uploadSlot, state, uploadFile, deleteFile }: Props): ReactElement => {
  const onFileInputChange: ReactEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files?.length !== 1) {
      return;
    }
    const file = files[0];

    if (file.size >= 33_554_432) {
      alert('Maximum file size is 32 MB');
      return;
    }

    uploadFile(uploadSlot.partId, uploadSlot.uploadSlotId, file).subscribe({
      next: () => { /* empty */ },
      error: () => { /* empty */ },
    });
  };

  const onDeleteButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    deleteFile(uploadSlot.partId, uploadSlot.uploadSlotId).subscribe({
      next: () => { /* empty */ },
      error: () => { /* empty */ },
    });
  };

  return (
    <>
      <div className="uploadSlot">
        <label htmlFor={uploadSlot.uploadSlotId} className="form-label fw-bold">{uploadSlot.label}:</label>
        {state.saveState === 'saving'
          ? <ProgressBar progress={state.progress} />
          : state.saveState === 'error' || state.saveState === 'empty'
            ? <input onChange={onFileInputChange} type="file" className="form-control" id={uploadSlot.uploadSlotId} />
            : state.saveState === 'saved'
              ? <div><button onClick={onDeleteButtonClick} className="btn btn-danger me-3">Delete</button>{uploadSlot.filename}</div>
              : <div />
        }
      </div>
      <style jsx>{`
      .uploadSlot {
        margin-bottom: 1rem;
      }
      .uploadSlot:last-of-type {
        margin-bottom: 0;
      }
      `}</style>
    </>
  );
};
