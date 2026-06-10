'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import styles from './CertificateView.module.css';
import directorSignature from './kayla.svg';
import registrarSignature from './lucie.svg';
import { MiniFlourish } from './MiniFlourish';
import { Seal } from './Seal';
import { svgToPngBase64 } from './svgToPngBase64';

interface Props {
  name: string;
  courseName: string;
  schoolName: string;
  date: Date;
}

export const CertificateView: FC<Props> = ({ name, courseName, schoolName, date }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ scale, setScale ] = useState(1);
  const [ registrarPng, setRegistrarPng ] = useState('');
  const [ directorPng, setDirectorPng ] = useState('');

  svgToPngBase64(registrarSignature.src).then(setRegistrarPng).catch(console.error);
  svgToPngBase64(directorSignature.src).then(setDirectorPng).catch(console.error);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current?.parentElement) {
        const parentWidth = containerRef.current.parentElement.clientWidth;
        // The natural width of the certificate canvas is 1056px
        const newScale = Math.min(parentWidth / 1056, 1);
        setScale(newScale);
      }
    };

    handleResize();

    if (containerRef.current?.parentElement) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current.parentElement);
      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaledHeight = 816 * scale;

  return (
    <div style={{ height: `${scaledHeight}px` }}>
      <div ref={containerRef} className="certificate-container relative shrink-0 print-full-page select-none origin-top" style={{ transform: `scale(${scale})`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 0 40px rgba(0,0,0,0.02)' }}>
        <div className={styles.institutionHeader}>{schoolName}</div>

        <div className="flex items-center justify-center p-4" style={{ position: 'absolute', top: '172px', left: '80px', width: '896px', height: '120px', margin: '0px' }}>
          <div className={` ${styles.recipientName} select-text w-full text-center`}>{name}</div>
        </div>

        <div className={` ${styles.metaSubtext} ${styles.requirements}`}> has completed all requirements of</div>
        <div style={{ position: 'absolute', top: '365px', left: '80px', width: '896px', height: '69px', borderTop: '1.5px solid #000000', borderBottom: '1.5px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '0 16px', zIndex: 10 }}>
          <h2 className={styles.courseTitle}>{courseName}</h2>
        </div>
        <div style={{ position: 'absolute', top: '454px', left: '488px', width: '80px', display: 'flex', justifyContent: 'center' }}>
          <MiniFlourish />
        </div>
        <div className={`${styles.metaSubtext} ${styles.officialGraduateText}`}>and is an official graduate of {schoolName}</div>

        <div style={{ position: 'absolute', top: '520px', left: '80px', width: '896px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px' }}>
          <span className={styles.graduationDate}>
            {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div style={{ position: 'absolute', left: '80px', top: '715px', width: '240px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={registrarPng} alt="Registrar Signature" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', height: '80px', width: 'auto', maxHeight: '140%', objectFit: 'contain' }} />
          <div style={{ height: '1px', backgroundColor: '#000000', width: '100%' }} />
          <div className={`${styles.signature} ${styles.metaSubtext}`}>Registrar</div>
        </div>

        <div style={{ position: 'absolute', left: '468px', top: '645px', width: '120px', height: '120px' }}>
          <Seal />
        </div>

        {/* 7.3 RIGHT COLUMN (Student Support Executive Section) */}
        <div style={{ position: 'absolute', left: '736px', top: '715px', width: '240px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={directorPng} alt="Director Signature" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', height: '80px', width: 'auto', maxHeight: '144%', objectFit: 'contain' }} />
          <div style={{ height: '1px', backgroundColor: '#000000', width: '100%' }} />
          <div className={`${styles.signature} ${styles.metaSubtext}`}>Director of Student Support</div>
        </div>

      </div>
    </div>
  );
};
