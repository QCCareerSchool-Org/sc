import { MouseEventHandler, ReactElement, ReactEventHandler } from 'react';

import { UploadSlotFunction } from '.';
import { ProgressBar } from '@/components/ProgressBar';
import { UploadSlotState } from '@/components/students/NewAssignmentView/state';
import { NewUploadSlot } from '@/domain/students';
import { newAssignmentService } from '@/services/students';

type Props = {
  studentId: number;
  unitId: string;
  assignmentId: string;
  uploadSlot: NewUploadSlot;
  state: UploadSlotState;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
};

export const NewUploadSlotForm = ({ studentId, unitId, assignmentId, uploadSlot, state, uploadFile, deleteFile }: Props): ReactElement => {
  return (
    <>
      <div className="uploadSlot">
        <label htmlFor={uploadSlot.uploadSlotId} className="form-label"><span className="fw-bold">{uploadSlot.label}:</span> <small>(type: {formatList(uploadSlot.allowedTypes)})</small></label>
        {state.saveState === 'saving'
          ? <ProgressBar progress={state.progress}>{state.progress}%</ProgressBar>
          : state.saveState === 'save error' || state.saveState === 'empty'
            ? <EmptySlot uploadSlot={uploadSlot} state={state} uploadFile={uploadFile} />
            : state.saveState === 'deleting' || state.saveState === 'delete error' || state.saveState === 'saved'
              ? <FullSlot studentId={studentId} unitId={unitId} assignmentId={assignmentId} uploadSlot={uploadSlot} state={state} deleteFile={deleteFile} />
              : <div />
        }
        {uploadSlot.optional
          ? <small className="text-danger">optional</small>
          : <div className="spacer" />
        }
      </div>
      <style jsx>{`
      .uploadSlot {
        margin-bottom: 0.5rem;
      }
      .spacer {
        height: 0.5rem;
      }
      .uploadSlot:last-of-type {
        margin-bottom: 0;
      }
      `}</style>
    </>
  );
};

type EmptySlotProps = {
  uploadSlot: NewUploadSlot;
  state: UploadSlotState;
  uploadFile: UploadSlotFunction;
};
const EmptySlot = ({ uploadSlot, state, uploadFile }: EmptySlotProps): ReactElement => {
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

  return (
    <>
      <input onChange={onFileInputChange} type="file" accept={accept(uploadSlot.allowedTypes)} className="form-control" id={uploadSlot.uploadSlotId} />
      {state.saveState === 'save error' && <small className="text-danger">Error saving file</small>}
    </>
  );
};

type FullSlotProps = {
  studentId: number;
  unitId: string;
  assignmentId: string;
  uploadSlot: NewUploadSlot;
  state: UploadSlotState;
  deleteFile: UploadSlotFunction;
};
const FullSlot = ({ studentId, unitId, assignmentId, uploadSlot, state, deleteFile }: FullSlotProps): ReactElement => {
  const onDeleteButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    deleteFile(uploadSlot.partId, uploadSlot.uploadSlotId).subscribe({
      next: () => { /* empty */ },
      error: () => { /* empty */ },
    });
  };

  const downloadClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    newAssignmentService.downloadFile(studentId, unitId, assignmentId, uploadSlot.partId, uploadSlot.uploadSlotId).subscribe();
  };

  return (
    <>
      <div className="d-flex flex-column-reverse flex-md-row align-items-md-center">
        <button
          onClick={onDeleteButtonClick}
          className="btn btn-danger me-3 mt-2 mt-md-0"
          style={{ width: 90 }} // fixed width so that the button doesn't change size when the text is replaced with a spinner
          disabled={state.saveState === 'deleting'}
        >{state.saveState === 'deleting' ? <div className="spinner-border spinner-border-sm" /> : 'Delete'}</button>
        {uploadSlot.filename && <><a href="#" onClick={downloadClick}><span style={{ wordBreak: 'break-all' }}>{trimFilename(uploadSlot.filename)}</span></a>&nbsp; {uploadSlot.size && <>({humanReadablefilesize(uploadSlot.size)})</>}</>}
      </div>
      {state.saveState === 'delete error' && <small className="text-danger">Error deleting file</small>}
    </>
  );
};

const accept = (allowedTypes: string[]): string => {
  const accepted = [];
  for (const allowedType of allowedTypes) {
    if (allowedType === 'image') {
      accepted.push('image/jpeg', 'image/png', 'image/x-png', 'image/bmp', 'image/gif');
    } else if (allowedType === 'pdf') {
      accepted.push('application/pdf');
    } else if (allowedType === 'Word document') {
      accepted.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword');
    } else if (allowedType === 'Excel spreadsheet') {
      accepted.push('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel');
    }
  }
  return accepted.join(',');
};

const formatList = (list: string[]): string => {
  if (list.length > 2) {
    return list.slice(0, -1).join(', ') + ', or ' + list[list.length - 1];
  }
  return list.join(' or ');
};

const trimFilename = (filename: string, maxLength = 32): string => {
  if (filename.length <= maxLength) {
    return filename;
  }
  const lastPeriodPosition = filename.lastIndexOf('.');
  // no file extension
  if (lastPeriodPosition === -1) {
    return filename.substring(0, maxLength - 3) + '...';
  }
  // with file extension
  const firstPart = filename.substring(0, lastPeriodPosition);
  const lastPart = filename.substring(lastPeriodPosition);
  return firstPart.substring(0, Math.min(maxLength, firstPart.length) - 2 - lastPart.length) + '..' + lastPart;
};

const humanReadablefilesize = (filesize: number): string => {
  if (filesize < 1024) {
    return `${filesize} B`;
  }
  filesize /= 1024;
  if (filesize < 1024) {
    return `${filesize.toFixed(1)} KB`;
  }
  filesize /= 1024;
  if (filesize < 1024) {
    return `${filesize.toFixed(1)} MB`;
  }
  filesize /= 1024;
  return `${filesize.toFixed(1)} GB`;
};
