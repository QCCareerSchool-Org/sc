import type { ReactElement } from 'react';
import { memo } from 'react';
import { FaFile, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { useScreenWidth } from '@/hooks/useScreenWidth';

type Props = {
  mimeType: string;
};

export const FileIcon = memo(({ mimeType }: Props): ReactElement => {
  const screenWidth = useScreenWidth();

  const lgOrGreater = screenWidth >= 992;
  const iconSize = lgOrGreater ? 128 : 96;

  return (
    <>
      <div className="d-inline-block me-2 offset">
        <Icon mimeType={mimeType} iconSize={iconSize} />
      </div>
      <style jsx>{`
      .offset {
        position: relative;
        left: ${lgOrGreater ? -16 : -12}px;
      }
      `}</style>
    </>
  );
});

FileIcon.displayName = 'FileIcon';

type IconProps = {
  mimeType: string;
  iconSize: number;
};

const Icon = ({ mimeType, iconSize }: IconProps): ReactElement => {
  if (mimeType === 'application/pdf') {
    return <FaFilePdf size={iconSize} />;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
    return <FaFileWord size={iconSize} />;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimeType === 'application/vnd.ms-excel') {
    return <FaFileExcel size={iconSize} />;
  }
  return <FaFile size={iconSize} />;
};
