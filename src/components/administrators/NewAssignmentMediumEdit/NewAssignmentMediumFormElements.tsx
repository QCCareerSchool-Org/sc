import type { ChangeEventHandler, FC } from 'react';
import { useId } from 'react';

import type { State } from './state';
import { ProgressBar } from '@/components/ProgressBar';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  onCaptionChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
} & ({
  formType: 'edit';
  inserting?: never;
  progress?: never;
  onDataSourceChange?: never;
  onFileChange?: never;
  onExternalDataChange?: never;
} | {
  formType: 'add';
  inserting: boolean;
  progress: number;
  onDataSourceChange: (dataSource: 'file upload' | 'url') => void;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onExternalDataChange: ChangeEventHandler<HTMLInputElement>;
});

const allowedMimeTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export const NewAssignmentMediumFormElements: FC<Props> = props => {
  const { formType, formData, formValidationMessages, inserting, progress } = props;

  const id = useId();

  const handleDataSourceChange = (dataSource: 'file upload' | 'url'): void => {
    props.onDataSourceChange?.(dataSource);
  };

  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentMediaCaption'} className="form-label">Caption <span className="text-danger">*</span></label>
        <input onChange={props.onCaptionChange} value={formData.caption} type="text" id={id + '_newAssignmentMediaCaption'} maxLength={191} className={`form-control ${formValidationMessages.caption ? 'is-invalid' : ''}`} required />
        {formValidationMessages.caption && <div className="invalid-feedback">{formValidationMessages.caption}</div>}
      </div>

      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentMediaOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={e => props.onOrderChange(e)} value={formData.order} type="number" id={id + '_newAssignmentMediaOrder'} min={0} max={127} className={`form-control ${formValidationMessages.order ? 'is-invalid' : ''}`} required />
        {formValidationMessages.order && <div className="invalid-feedback">{formValidationMessages.order}</div>}
      </div>

      {formType === 'add' && (
        <>
          <ul className="nav nav-tabs" id={id + '_newAssignmentMediaFileTab'} role="tablist">
            <li className="nav-item" role="presentation">
              <button onClick={() => handleDataSourceChange('file upload')} className={`nav-link ${formData.dataSource === 'file upload' ? 'active' : ''}`} id={id + '_uploadTab'} type="button" role="tab" aria-controls={id + '_upload'} aria-selected={formData.dataSource === 'file upload'}>File Upload</button>
            </li>
            <li className="nav-item" role="presentation">
              <button onClick={() => handleDataSourceChange('url')} className={`nav-link ${formData.dataSource === 'url' ? 'active' : ''}`} id={id + '_externalTab'} type="button" role="tab" aria-controls={id + '_external'} aria-selected={formData.dataSource === 'url'}>External Data</button>
            </li>
          </ul>

          <div className="tab-content" id={id + '_newAssignmentMediaFileContent'}>

            <div className={`tab-pane fade ${formData.dataSource === 'file upload' ? 'show active' : ''}`} id={id + '_upload'} role="tabpanel" aria-labelledby={id + '_uploadTab'}>
              <div className="formGroup">
                <label htmlFor={id + '_newAssignmentMediaFile'} className="form-label">File{formData.dataSource === 'file upload' && <> <span className="text-danger">*</span></>}</label>
                {inserting && typeof progress !== 'undefined'
                  ? <ProgressBar progress={progress}>{progress.toFixed(0)}%</ProgressBar>
                  : (
                    <>
                      <input onChange={props.onFileChange} className={`form-control ${formValidationMessages.file ? 'is-invalid' : ''}`} type="file" accept={allowedMimeTypes.join(',')} id="newAssignmentMediaFile" aria-describedby={id + '_newAssignmentMediaFileHelp'} required={formData.dataSource === 'file upload'} />
                      <div id="newAssignmentMediaFileHelp" className="form-text">Select a file from your computer to upload</div>
                    </>
                  )}
                {formValidationMessages.file && <div className="invalid-feedback">{formValidationMessages.file}</div>}
              </div>
            </div>

            <div className={`tab-pane fade ${formData.dataSource === 'url' ? 'show active' : ''}`} id={id + '_external'} role="tabpanel" aria-labelledby={id + '_profile-tab'}>
              <div className="formGroup">
                <label htmlFor={id + '_newAssignmentMediaExternalData'} className="form-label">External URL {formData.dataSource === 'url' && <> <span className="text-danger">*</span></>}</label>
                <input onChange={props.onExternalDataChange} value={formData.externalData} id={id + '_newAssignmentMediaExternalData'} maxLength={1024} className={`form-control ${formValidationMessages.externalData ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentMediaExternalDataHelp'} required={formData.dataSource === 'url'} />
                <div id={id + '_newAssignmentMediaExternalDataHelp'} className="form-text">Enter a URL starting with https://</div>
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
