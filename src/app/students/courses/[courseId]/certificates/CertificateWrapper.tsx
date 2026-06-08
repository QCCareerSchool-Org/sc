'use client';
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';

import { handleDownloadPDF } from './handlePDFDownload';
import Certificate from '../../../../Certificate';
interface CertificateProps {
  courseName: string;
  schoolName: string;
  registrarSignatureUrl: StaticImageData;
  directorSignatureUrl: StaticImageData;
  name: string;
  date: Date; }

const svgToPngBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const svgText = await response.text();
  return new Promise(resolve => {
    const img = new window.Image();
    const blob = new Blob([ svgText ], { type: 'image/svg+xml' });
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 300;
      canvas.height = img.naturalHeight || 100;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        resolve(url);
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = objectUrl;
  });
};

export const CertificateWrapper = ({ courseName, schoolName, name, registrarSignatureUrl, directorSignatureUrl, date }: CertificateProps) => {
  const [ isGeneratingPDF, setIsGeneratingPDF ] = useState(false);
  const [ registrarPng, setRegistrarPng ] = useState<string>('');
  const [ directorPng, setDirectorPng ] = useState<string>('');

  useEffect(() => {
    void svgToPngBase64(registrarSignatureUrl.src).then(setRegistrarPng);
    void svgToPngBase64(directorSignatureUrl.src).then(setDirectorPng);
  }, [ registrarSignatureUrl.src, directorSignatureUrl.src ]);

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
        <div className="flex items-center gap-2">
          <button
            disabled={isGeneratingPDF}
            onClick={handleDownload}
            className="btn btn-primary rounded-pill fw-bold d-inline-flex align-items-center gap-1 flex-shrink-0"
          >
            <FaDownload className="w-3 h-3 shrink-0" />
            <span>{isGeneratingPDF ? 'Saving...' : 'Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Certificate frame */}
      <div
        className="container"
        style={{
          backgroundColor: 'white',
          border: '1px solid rgba(210, 210, 215, 0.5)',
          borderRadius: '0 0 16px 16px',
          padding: '4px',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '1056px',
          margin: '0 auto',
        }}
      >
        <Certificate courseName={courseName} schoolName={schoolName} name={name} registrarSignatureUrl={registrarPng} directorSignatureUrl={directorPng} date={date} />
      </div>
    </section>
  );
};
