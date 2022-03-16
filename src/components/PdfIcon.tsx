import type { ReactElement } from 'react';
import { FaFilePdf } from 'react-icons/fa';

export const PdfIcon = (): ReactElement => (
  <>
    <div className="offset">
      <FaFilePdf size={96} />
    </div>
    <style jsx>{`
    .offset {
      position: relative;
      left: -8px;
    }
    `}</style>
  </>
);
