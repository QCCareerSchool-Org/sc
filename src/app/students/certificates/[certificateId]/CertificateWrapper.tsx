'use client';
import { useState } from 'react';

import Certificate from './Certificate';
import { handleDownloadPDF } from './handlePDFDownload';
interface CertificateProps {
  courseName: string;
  schoolName: string;
  registrarSignatureUrl: StaticImageData;
  directorSignatureUrl: StaticImageData;
  name: string;
  date: Date; }

export const CertificateWrapper = ({ courseName, schoolName, name, registrarSignatureUrl, directorSignatureUrl, date }: CertificateProps) => {
  const [ isGeneratingPDF, setIsGeneratingPDF ] = useState(false);

  const handleDownload = () => {
    void handleDownloadPDF(name, setIsGeneratingPDF);
  };
  return (
    <section>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1D1D1F',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          padding: '12px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Official Digital Certificate
          </span>
        </div>
        <button disabled={isGeneratingPDF} onClick={handleDownload}>
          {isGeneratingPDF ? 'Saving...' : 'Save PDF'}
        </button>
      </div>

      {/* Certificate frame */}
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid rgba(210, 210, 215, 0.5)',
          borderRadius: '0 0 16px 16px',
          padding: '4px',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Certificate courseName={courseName} schoolName={schoolName} name={name} registrarSignatureUrl={registrarSignatureUrl} directorSignatureUrl={directorSignatureUrl} date={date} />
      </div>
    </section>
  );
};
