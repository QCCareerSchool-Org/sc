import type { ReactElement } from 'react';

import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';

type Props = {
  newUploadSlotTemplate: NewUploadSlotTemplate;
};

export const NewUploadSlotTemplatePreview = ({ newUploadSlotTemplate }: Props): ReactElement => {
  return (
    <>
      <div className="formGroup">
        <label htmlFor={newUploadSlotTemplate.uploadSlotTemplateId} className="form-label"><span className="fw-bold">{newUploadSlotTemplate.label}:</span> <small>({formatList(newUploadSlotTemplate.allowedTypes.map(allowedTypeName))})</small></label>
        <input type="file" accept={accept(newUploadSlotTemplate.allowedTypes)} className="form-control" id={newUploadSlotTemplate.uploadSlotTemplateId} />
        {newUploadSlotTemplate.optional
          ? <small className="text-danger me-2">optional</small>
          : <div className="spacer" />
        }
      </div>
      <style jsx>{`
        .formGroup {
          margin-bottom: 1rem;
        }
        .formGroup:last-of-type {
          margin-bottom: 0;
        }
        .spacer {
          height: 0.5rem;
        }
      `}</style>
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

const allowedTypeName = (allowedType: string): string => {
  if (allowedType === 'image') {
    return 'image';
  }
  if (allowedType === 'pdf') {
    return 'PDF document';
  }
  if (allowedType === 'word') {
    return 'Word document';
  }
  if (allowedType === 'excel') {
    return 'Excel document';
  }
  return allowedType;
};

const formatList = (list: string[]): string => {
  if (list.length > 2) {
    return list.slice(0, -1).join(', ') + ', or ' + list[list.length - 1];
  }
  return list.join(' or ');
};
