'use client';

import type { FC, PropsWithChildren } from 'react';
import { useRef } from 'react';
import { FaDownload } from 'react-icons/fa';

import { handleDownload } from './handleDownload';

interface Props {
  savePdf?: boolean;
}

export const CertificateWrapper: FC<PropsWithChildren<Props>> = ({ savePdf, children }) => {
  const generating = useRef(false);

  const handleDownloadClick = () => {
    if (generating.current) {
      return;
    }

    generating.current = true;

    void handleDownload().finally(() => {
      generating.current = false;
    });
  };

  return (
    <section>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1D1D1F', color: 'white', borderRadius: '16px 16px 0 0', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Official Digital Certificate</span>
        </div>
        {savePdf && <button onClick={handleDownloadClick} className="btn btn-primary btn-sm"><FaDownload /> Save PDF</button>}
      </div>

      {/* Certificate frame */}
      <div className="container" style={{ backgroundColor: 'white', border: '1px solid rgba(210, 210, 215, 0.5)', borderRadius: '0 0 16px 16px', padding: '4px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '1056px', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
};
