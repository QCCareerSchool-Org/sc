import type { ReactElement } from 'react';
import { FaDownload, FaFile, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';

import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium } from '@/domain/newPartMedium';

type Props = {
  medium: NewAssignmentMedium | NewPartMedium;
};

const humanReadableFileSize = (filesize: number): string => {
  if (filesize < 1024) {
    return `${filesize} B`;
  }
  if (filesize < 1_048_576) {
    return `${Math.round(filesize / 1024)} KB`;
  }
  if (filesize < 1_073_741_824) {
    return `${Math.round(filesize / 1_048_576)} MB`;
  }
  return `${Math.round(filesize / 1_073_741_824)} GB`;
};

export const DownloadMedium = ({ medium }: Props): ReactElement => (
  <div className="downloadMedium">
    <div className="fileIcon">
      <Icon mimeType={medium.mimeTypeId} size={36} />
    </div>

    <div className="description">
      <div>{medium.caption}</div>
      <small className="text-muted">{humanReadableFileSize(medium.size)}</small>
    </div>

    <div className="downloadIcon">
      <FaDownload />
    </div>

    <style jsx>{`
    .downloadMedium {
      border: 1px solid rgba(0,0,0,.25);
      padding: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
    }
    .downloadMedium:hover {
      color: #666;
    }
    .fileIcon {
      margin-right: 1rem;
    }
    .description {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .downloadIcon {
      margin-left: auto;
      padding: 0 1rem;
    }
    `}</style>
  </div>
);

type IconProps = {
  mimeType: string;
  size: number;
};

const Icon = ({ mimeType, size }: IconProps): ReactElement => {
  if (mimeType === 'application/pdf') {
    return <FaFilePdf size={size} />;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
    return <FaFileWord size={size} />;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimeType === 'application/vnd.ms-excel') {
    return <FaFileExcel size={size} />;
  }
  return <FaFile size={size} />;
};
