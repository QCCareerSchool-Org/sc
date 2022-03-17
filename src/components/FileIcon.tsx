import type { ReactElement } from 'react';
import { FaFile, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';

type Props = {
  mimeType: string;
  size: number;
};

export const FileIcon = ({ mimeType, size }: Props): ReactElement => {
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
