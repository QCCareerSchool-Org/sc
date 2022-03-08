import { ChangeEventHandler, FormEventHandler, memo, MouseEventHandler, ReactElement, useRef } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';

type Props = {
  formState: State['assignmentMediaForm'];
  insert$: Subject<{ processingState: State['assignmentMediaForm']['processingState']; payload: undefined }>;
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  dataSourceChange: (dataSource: 'file upload' | 'url') => void;
  typeChange: ChangeEventHandler<HTMLInputElement>;
  fileChange: ChangeEventHandler<HTMLInputElement>;
  externalDataChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentMediumAddForm = memo(({ formState, insert$, captionChange, orderChange, dataSourceChange, typeChange, fileChange, externalDataChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['assignmentMediaForm']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      processingState: formState.processingState,
      payload: undefined,
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="h5">New Assignment Medium</h3>
          <form onSubmit={formSubmit}>

            <div className="formGroup">
              <label htmlFor="newAssignmentMediaCaption" className="form-label">Caption</label>
              <input onChange={captionChange} value={formState.data.caption} type="text" id="newAssignmentMediaCaption" maxLength={191} className={`form-control ${formState.validationMessages.caption ? 'is-invalid' : ''}`} placeholder="(none)" />
              {formState.validationMessages.caption && <div className="invalid-feedback">{formState.validationMessages.caption}</div>}
            </div>

            <div className="formGroup">
              <label htmlFor="newAssignmentMediaOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newAssignmentMediaOrder" min={0} max={127} className={`form-control ${formState.validationMessages.caption ? 'is-invalid' : ''}`} />
              {formState.validationMessages.caption && <div className="invalid-feedback">{formState.validationMessages.caption}</div>}
            </div>

            <ul className="nav nav-tabs" id="newAssignmentMediaFileTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button onClick={() => dataSourceChange('file upload')} className={`nav-link ${formState.data.dataSource === 'file upload' ? 'active' : ''}`} id="uploadTab" type="button" role="tab" aria-controls="upload" aria-selected={formState.data.dataSource === 'file upload'}>File Upload</button>
              </li>
              <li className="nav-item" role="presentation">
                <button onClick={() => dataSourceChange('url')} className={`nav-link ${formState.data.dataSource === 'url' ? 'active' : ''}`} id="externalTab" type="button" role="tab" aria-controls="external" aria-selected={formState.data.dataSource === 'url'}>External Data</button>
              </li>
            </ul>

            <div className="tab-content" id="newAssignmentMediaFileContent">

              <div className={`tab-pane fade ${formState.data.dataSource === 'file upload' ? 'show active' : ''}`} id="upload" role="tabpanel" aria-labelledby="uploadTab">
                <div className="formGroup">
                  <label htmlFor="newAssignmentMediaFile" className="form-label">File{formState.data.dataSource === 'file upload' && <> <span className="text-danger">*</span></>}</label>
                  <input onChange={fileChange} className={`form-control ${formState.validationMessages.file ? 'is-invalid' : ''}`} type="file" accept="image/*, video/*, audio/*" id="newAssignmentMediaFile" aria-describedby="newAssignmentMediaFileHelp" required={formState.data.dataSource === 'file upload'} />
                  <div id="newAssignmentMediaFileHelp" className="form-text">Select a file from your computer to upload</div>
                  {formState.validationMessages.file && <div className="invalid-feedback">{formState.validationMessages.file}</div>}
                </div>
              </div>

              <div className={`tab-pane fade ${formState.data.dataSource === 'url' ? 'show active' : ''}`} id="external" role="tabpanel" aria-labelledby="profile-tab">
                <div className="formGroup">
                  <label htmlFor="newAssignmentMediaExternalData" className="form-label">External URL {formState.data.dataSource === 'url' && <> <span className="text-danger">*</span></>}</label>
                  <input onChange={externalDataChange} value={formState.data.externalData} id="newAssignmentMediaExternalData" maxLength={1024} className={`form-control ${formState.validationMessages.externalData ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentMediaExternalDataHelp" required={formState.data.dataSource === 'url'} />
                  <div id="newAssignmentMediaExternalDataHelp" className="form-text">Enter a URL starting with https://</div>
                  {formState.validationMessages.externalData && <div className="invalid-feedback">{formState.validationMessages.externalData}</div>}
                </div>
                <div className="formGroup">
                  <div className="form-check">
                    <input onChange={typeChange} checked={formState.data.type === 'image'} type="radio" value="image" id="newAssignmentMediaImage" className={`form-check-input ${formState.validationMessages.type ? 'is-invalid' : ''}`} />
                    <label htmlFor="newAssignmentMediaImage" className="form-check-label">Image</label>
                  </div>
                  <div className="form-check">
                    <input onChange={typeChange} checked={formState.data.type === 'video'} type="radio" value="video" id="newAssignmentMediaVideo" className={`form-check-input ${formState.validationMessages.type ? 'is-invalid' : ''}`} />
                    <label htmlFor="newAssignmentMediaVideo" className="form-check-label">Video</label>
                  </div>
                  <div className="form-check">
                    <input onChange={typeChange} checked={formState.data.type === 'audio'} type="radio" value="audio" id="newAssignmentMediaAudio" className={`form-check-input ${formState.validationMessages.type ? 'is-invalid' : ''}`} />
                    <label htmlFor="newAssignmentMediaAudio" className="form-check-label">Audio</label>
                  </div>
                </div>
              </div>

            </div>

            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
                {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
              </button>
              {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
        .form-text { font-size: 0.75rem; }
        .tab-content { margin-top: 1rem; }
      `}</style>
    </>
  );
});

NewAssignmentMediumAddForm.displayName = 'NewAssignmentMediumAddForm';
