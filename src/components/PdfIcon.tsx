import type { ReactElement } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { useScreenWidth } from '@/hooks/useScreenWidth';

export const PdfIcon = (): ReactElement => {
  const screenWidth = useScreenWidth();

  const lgOrGreater = screenWidth >= 992;

  return (
    <>
      <div className="offset">
        <FaFilePdf size={lgOrGreater ? 128 : 96} />
      </div>
      <style jsx>{`
    .offset {
      position: relative;
      left: ${lgOrGreater ? -16 : -12}px;
    }
    `}</style>
    </>
  );
};
