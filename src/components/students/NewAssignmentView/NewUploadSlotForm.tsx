import type { ChangeEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo, useEffect, useRef } from 'react';
import { exhaustMap, filter, Subject, takeUntil } from 'rxjs';

import type { UploadSlotFunction } from '.';
import { ProgressBar } from '@/components/ProgressBar';
import { Spinner } from '@/components/Spinner';
import type { UploadSlotState } from '@/components/students/NewAssignmentView/state';

type Props = {
  uploadSlot: UploadSlotState;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const NewUploadSlotForm = memo(({ uploadSlot, uploadFile, deleteFile, downloadFile }: Props): ReactElement => {
  const upload$ = useRef(new Subject<{ state: UploadSlotState; file: File }>());
  const download$ = useRef(new Subject<UploadSlotState>());
  const delete$ = useRef(new Subject<UploadSlotState>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    upload$.current.pipe(
      filter(({ state }) => state.saveState !== 'saving' && state.saveState !== 'deleting'),
      exhaustMap(({ file }) => uploadFile(uploadSlot.partId, uploadSlot.uploadSlotId, file)),
      takeUntil(destroy$),
    ).subscribe();

    download$.current.pipe(
      filter(u => u.saveState !== 'saving' && u.saveState !== 'deleting'),
      exhaustMap(() => downloadFile(uploadSlot.partId, uploadSlot.uploadSlotId)),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(u => u.saveState !== 'saving' && u.saveState !== 'deleting'),
      exhaustMap(() => deleteFile(uploadSlot.partId, uploadSlot.uploadSlotId)),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ uploadFile, downloadFile, deleteFile, uploadSlot.partId, uploadSlot.uploadSlotId ]);

  return (
    <>
      <div className="uploadSlot">
        <label htmlFor={uploadSlot.uploadSlotId} className="form-label"><span className="fw-bold">{uploadSlot.label}:</span> <small>(type: {formatList(uploadSlot.allowedTypes)})</small></label>
        {uploadSlot.saveState === 'saving'
          ? <ProgressBar progress={uploadSlot.progress}>{uploadSlot.progress}%</ProgressBar>
          : uploadSlot.saveState === 'save error' || uploadSlot.saveState === 'empty'
            ? <EmptySlot uploadSlot={uploadSlot} upload$={upload$.current} />
            : uploadSlot.saveState === 'deleting' || uploadSlot.saveState === 'delete error' || uploadSlot.saveState === 'saved'
              ? <FullSlot uploadSlot={uploadSlot} delete$={delete$.current} download$={download$.current} />
              : <div />
        }
        {uploadSlot.optional
          ? <small className="text-danger me-2">optional</small>
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
});

NewUploadSlotForm.displayName = 'NewUploadSlotForm';

type EmptySlotProps = {
  uploadSlot: UploadSlotState;
  upload$: Subject<{ state: UploadSlotState; file: File }>;
};

const EmptySlot = ({ uploadSlot, upload$ }: EmptySlotProps): ReactElement => {
  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    const files = e.target.files;
    if (files?.length !== 1) {
      return;
    }
    const file = files[0];

    if (file.size >= 33_554_432) {
      alert('Maximum file size is 32 MB');
      return;
    }

    upload$.next({ state: uploadSlot, file });
  };

  return (
    <>
      <input onChange={onFileInputChange} type="file" accept={accept(uploadSlot.allowedTypes)} className="form-control" id={uploadSlot.uploadSlotId} />
      {uploadSlot.saveState === 'save error' && <small className="text-danger me-2">Error saving file</small>}
    </>
  );
};

type FullSlotProps = {
  uploadSlot: UploadSlotState;
  delete$: Subject<UploadSlotState>;
  download$: Subject<UploadSlotState>;
};

const FullSlot = ({ uploadSlot, delete$, download$ }: FullSlotProps): ReactElement => {
  const deleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    delete$.next(uploadSlot);
  };

  const downloadClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    download$.next(uploadSlot);
  };

  return (
    <>
      <div className="d-flex flex-column-reverse flex-md-row align-items-md-center">
        <button
          onClick={deleteClick}
          className="btn btn-danger me-3 mt-2 mt-md-0"
          style={{ width: 90 }} // fixed width so that the button doesn't change size when the text is replaced with a spinner
          disabled={uploadSlot.saveState === 'deleting'}
        >{uploadSlot.saveState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}</button>
        {uploadSlot.filename && <><a href="#" onClick={downloadClick}><span style={{ wordBreak: 'break-all' }}>{trimFilename(uploadSlot.filename)}</span></a>&nbsp; {uploadSlot.size && <>({humanReadablefilesize(uploadSlot.size)})</>}</>}
      </div>
      {uploadSlot.saveState === 'delete error' && <small className="text-danger me-2">Error deleting file</small>}
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
    } else if (allowedType === 'word') {
      accepted.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword');
    } else if (allowedType === 'excel') {
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
