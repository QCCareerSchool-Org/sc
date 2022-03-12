import type { ChangeEventHandler, ReactElement } from 'react';

import type { State } from './state';
import { ProgressBar } from '@/components/ProgressBar';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  captionChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
} & ({
  formType: 'edit';
  inserting?: never;
  progress?: never;
  dataSourceChange?: never;
  fileChange?: never;
  externalDataChange?: never;
} | {
  formType: 'add';
  inserting: boolean;
  progress: number;
  dataSourceChange: (dataSource: 'file upload' | 'url') => void;
  fileChange: ChangeEventHandler<HTMLInputElement>;
  externalDataChange: ChangeEventHandler<HTMLInputElement>;
});

export const NewAssignmentMediumFormElements = ({ formType, formData, formValidationMessages, inserting, progress, dataSourceChange, captionChange, orderChange, fileChange, externalDataChange }: Props): ReactElement => {
  return (
    <>
      <div className="formGroup">
        <label htmlFor="newAssignmentMediaCaption" className="form-label">Caption <span className="text-danger">*</span></label>
        <input onChange={captionChange} value={formData.caption} type="text" id="newAssignmentMediaCaption" maxLength={191} className={`form-control ${formValidationMessages.caption ? 'is-invalid' : ''}`} required />
        {formValidationMessages.caption && <div className="invalid-feedback">{formValidationMessages.caption}</div>}
      </div>

      <div className="formGroup">
        <label htmlFor="newAssignmentMediaOrder" className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={orderChange} value={formData.order} type="number" id="newAssignmentMediaOrder" min={0} max={127} className={`form-control ${formValidationMessages.order ? 'is-invalid' : ''}`} required />
        {formValidationMessages.order && <div className="invalid-feedback">{formValidationMessages.order}</div>}
      </div>

      {formType === 'add' && (
        <>
          <ul className="nav nav-tabs" id="newAssignmentMediaFileTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button onClick={() => dataSourceChange?.('file upload')} className={`nav-link ${formData.dataSource === 'file upload' ? 'active' : ''}`} id="uploadTab" type="button" role="tab" aria-controls="upload" aria-selected={formData.dataSource === 'file upload'}>File Upload</button>
            </li>
            <li className="nav-item" role="presentation">
              <button onClick={() => dataSourceChange?.('url')} className={`nav-link ${formData.dataSource === 'url' ? 'active' : ''}`} id="externalTab" type="button" role="tab" aria-controls="external" aria-selected={formData.dataSource === 'url'}>External Data</button>
            </li>
          </ul>

          <div className="tab-content" id="newAssignmentMediaFileContent">

            <div className={`tab-pane fade ${formData.dataSource === 'file upload' ? 'show active' : ''}`} id="upload" role="tabpanel" aria-labelledby="uploadTab">
              <div className="formGroup">
                <label htmlFor="newAssignmentMediaFile" className="form-label">File{formData.dataSource === 'file upload' && <> <span className="text-danger">*</span></>}</label>
                {inserting && typeof progress !== 'undefined'
                  ? <ProgressBar progress={progress}>{progress.toFixed(0)}%</ProgressBar>
                  : (
                    <>
                      <input onChange={fileChange} className={`form-control ${formValidationMessages.file ? 'is-invalid' : ''}`} type="file" accept="image/*, video/*, audio/*" id="newAssignmentMediaFile" aria-describedby="newAssignmentMediaFileHelp" required={formData.dataSource === 'file upload'} />
                      <div id="newAssignmentMediaFileHelp" className="form-text">Select a file from your computer to upload</div>
                    </>
                  )}
                {formValidationMessages.file && <div className="invalid-feedback">{formValidationMessages.file}</div>}
              </div>
            </div>

            <div className={`tab-pane fade ${formData.dataSource === 'url' ? 'show active' : ''}`} id="external" role="tabpanel" aria-labelledby="profile-tab">
              <div className="formGroup">
                <label htmlFor="newAssignmentMediaExternalData" className="form-label">External URL {formData.dataSource === 'url' && <> <span className="text-danger">*</span></>}</label>
                <input onChange={externalDataChange} value={formData.externalData} id="newAssignmentMediaExternalData" maxLength={1024} className={`form-control ${formValidationMessages.externalData ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentMediaExternalDataHelp" required={formData.dataSource === 'url'} />
                <div id="newAssignmentMediaExternalDataHelp" className="form-text">Enter a URL starting with https://</div>
                {formValidationMessages.externalData && <div className="invalid-feedback">{formValidationMessages.externalData}</div>}
              </div>
            </div>

          </div>
        </>
      )}

      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      .tab-content { margin-top: 1rem; }
      `}</style>
    </>
  );
};
