import type { ReactElement } from 'react';
import { FaDownload } from 'react-icons/fa';

import { FileIcon } from './FileIcon';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium } from '@/domain/newPartMedium';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  medium: NewAssignmentMedium | NewPartMedium;
};

export const DownloadMedium = ({ medium }: Props): ReactElement => (
  <div className="downloadMedium">
    <div className="fileIcon">
      <FileIcon mimeType={medium.mimeTypeId} size={36} />
    </div>

    <div className="description">
      <div className="caption">{medium.caption}</div>
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
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
    }
    .caption {
      width: 100%;
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
