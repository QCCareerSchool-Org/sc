'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './Certificate.module.css';

interface CertificateProps {
  courseName: string;
  schoolName: string;
  registrarSignatureUrl: string;
  directorSignatureUrl: string;
  name: string;
  date: Date; }

const MiniFlourish = () => (
  <svg className="w-14 h-4" style={{ color: '#404040' }} viewBox="0 0 80 20" fill="currentColor">
    <path d="M40 5 C43 10, 48 12, 53 10 C54 11, 54 12, 52 13 C49 15, 44 13, 40 10 C36 13, 31 15, 28 13 C26 12, 26 11, 27 10 C32 12, 37 10, 40 5 Z" />
    <circle cx="40" cy="5" r="1.2" />
    <path d="M15 10 C20 10, 25 8, 28 10 C29 11, 28 12, 26 12 C22 12, 18 10, 15 10 Z" opacity="0.5" />
    <path d="M65 10 C60 10, 55 8, 52 10 C51 11, 52 12, 54 12 C58 12, 62 10, 65 10 Z" opacity="0.5" />
  </svg>
);

export default function Certificate({ courseName, schoolName, name, registrarSignatureUrl, directorSignatureUrl, date }: CertificateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ scale, setScale ] = useState(1);

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
  // Map schools to their proper label string dynamically
  const getSchoolLabel = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('design')) { return 'QC DESIGN SCHOOL'; }
    if (lower.includes('event')) { return 'QC EVENT SCHOOL'; }
    if (lower.includes('makeup')) { return 'QC MAKEUP ACADEMY'; }
    if (lower.includes('pet')) { return 'QC PET STUDIES'; }
    if (lower.includes('wellness')) { return 'QC WELLNESS STUDIES'; }
    return 'QC CAREER SCHOOL';
  };

  const schoolLabel = getSchoolLabel(schoolName);

  // SVG Flourish Ornaments for that exact elegant certificate look

  const scaledHeight = 816 * scale;

  return (
    <div
      className="certificate-scaler-wrapper w-full overflow-hidden flex justify-center items-start bg-neutral-50/50 py-2 sm:py-4 rounded-b-2xl animate-fade-in"
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        ref={containerRef}
        id="certificate-print-area"
        className="certificate-container relative shrink-0 print-full-page select-none origin-top"
        style={{
          transform: `scale(${scale})`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 0 40px rgba(0,0,0,0.02)',
        }}
      >

        {/* Corner Decorative Accents removed per user request */}

        {/* Gentle aged paper cream gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(255,252,246,0) 0%, rgba(255,252,246,0.08) 50%, rgba(255,252,246,0) 100%)',
          }}
        />

        {/* =========================================================================
         SECTION 1: SCHOOL HEADER BLOCK (Optimized spacing with fixed width for pristine alignment)
         ========================================================================= */}
        {/* Y=80px Institution Title (Cinzel serif, 28px) */}
        <div
          className={styles.institutionHeader}
          style={{
            position: 'absolute',
            top: '84px',
            left: '0px',
            width: '1056px',
            textAlign: 'center',
            lineHeight: '34px',
          }}
        >
          {schoolLabel}
        </div>

        {/* =========================================================================
         SECTION 2: RECIPIENT NAME BANNER WRAPPER (Visual breathing space)
         ========================================================================= */}
        <div
          className="flex items-center justify-center p-4"
          style={{
            position: 'absolute',
            top: '172px',
            left: '80px', // Centered perfectly on 1056px width
            width: '896px',
            height: '120px',
            margin: '0px',
          }}
        >
          <div
            className={` ${styles.recipientName} select-text w-full text-center`}
            style={{
              lineHeight: '1.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {name || 'Student Name'}
          </div>
        </div>

        {/* =========================================================================
         SECTION 3: REQUIREMENTS SUBTEXT LABEL (Center balanced)
         ========================================================================= */}
        <div
          className={` ${styles.metaSubtext} select-text`}
          style={{
            position: 'absolute',
            top: '325px',
            left: '80px',
            width: '896px',
            height: '20px',
            lineHeight: '20px',
            textAlign: 'center',
          }}
        >
          HAS COMPLETED ALL REQUIREMENTS OF THE
        </div>

        {/* =========================================================================
         SECTION 4: COURSE TITLE BANNER HEADER (Micro-adjusted for perfect symmetry)
         ========================================================================= */}
        {/* Unified Course Title Block with borders (Fixes html2canvas vertical baseline drift) */}
        <div
          style={{
            position: 'absolute',
            top: '365px',
            left: '80px',
            width: '896px',
            height: '69px',
            borderTop: '1.5px solid #000000',
            borderBottom: '1.5px solid #000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0 16px',
            zIndex: 10,
          }}
        >
          <h2
            className={styles.courseTitle}
            style={{
              margin: 0,
              padding: 0,
              lineHeight: '1.3',
              textAlign: 'center',
            }}
          >
            {schoolName === schoolLabel &&
           (courseName.trim().toUpperCase() === 'PROFESSIONAL ORGANIZING COURSE' ||
            courseName.trim().toUpperCase() === 'PROFESSIONAL ORGANIZING')
              ? 'ADVANCED INTERNATIONAL ORGANIZING PROFESSIONAL COURSE'
              : (courseName || 'THE ADVANCED PROFESSIONAL COURSE')}
          </h2>
        </div>

        {/* =========================================================================
         SECTION 5: AFFILIATION & ENDORSEMENT METADATA BLOCK
         ========================================================================= */}
        {/* mini anchor flourish centered above text */}
        <div
          style={{
            position: 'absolute',
            top: '454px',
            left: '488px', // Centered at 528px: 528 - (80/2) = 488px to avoid html2canvas translateX bug
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MiniFlourish />
        </div>

        {/* Endorsement affiliation string */}
        <div
          className={styles.metaSubtext}
          style={{
            position: 'absolute',
            top: '489px',
            left: '80px',
            width: '896px',
            textAlign: 'center',
            lineHeight: '14px',
          }}
        >
          AND IS AN OFFICIAL GRADUATE OF {schoolLabel}
        </div>

        {/* =========================================================================
         SECTION 6: GRADUATION DATE BANNER WRAPPER (Balanced display frame)
         ========================================================================= */}
        <div
          style={{
            position: 'absolute',
            top: '520px',
            left: '80px', // Centered perfectly on 1056px width
            width: '896px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0px',
          }}
        >
          <span
            className={` ${styles.recipientName} select-text`}
            style={{
              fontSize: '32px',
              lineHeight: '70px',
              color: '#1A1A1A',
            }}
          >
            {date || 'May 7th, 2013'}
          </span>
        </div>

        {/* =========================================================================
         SECTION 7: FOOTER SIGNATURE ROW MATRIX (715px - 755px | Height: 40px)
         ========================================================================= */}

        {/* 7.1 LEFT COLUMN (Registrar Endorsement Section) */}
        <div
          style={{
            position: 'absolute',
            left: '80px',
            top: '715px',
            width: '240px',
          }}
        >
          {/* Dynamic Signature */}
          {registrarSignatureUrl && (
          // eslint-disable-next-line @next/next/no-img-element
            <img
              src={registrarSignatureUrl}
              alt="Registrar Signature"
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '80px',
                width: 'auto',
                maxHeight: '140%',
                objectFit: 'contain',
              }}
            />
          )}
          {/* Signatory line */}
          <div style={{ height: '1px', backgroundColor: '#000000', width: '100%' }} />
          {/* Identity text label */}
          <div
            className={styles.metaSubtext}
            style={{
              marginTop: '11px',
              width: '100%',
              textAlign: 'center',
              fontSize: '10px',
            }}
          >
            REGISTRAR
          </div>
        </div>

        {/* 7.2 CENTER COLUMN (Official Seal) */}
        <div
          style={{
            position: 'absolute',
            left: '468px',
            top: '645px',
            width: '120px',
            height: '120px',
          }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Top path for CERTIFICATE. r=76 to account for text sitting above baseline. */}
              <path id="topTextPath" d="M 24 100 A 76 76 0 0 1 176 100" />

              {/* Bottom path for OF COMPLETION. r=84 to account for text sitting above baseline (towards center). */}
              <path id="bottomTextPath" d="M 16 100 A 84 84 0 0 0 184 100" />
            </defs>

            {/* Inner circle */}
            <circle cx="100" cy="100" r="64" fill="none" stroke="#222" strokeWidth="1.5" />

            {/* Outer circle arcs (broken for text top and bottom) */}
            {/* Left arc */}
            <path d="M 38.7 48.6 A 80 80 0 0 0 38.7 151.4" fill="none" stroke="#222" strokeWidth="1.5" />
            {/* Right arc */}
            <path d="M 161.3 48.6 A 80 80 0 0 1 161.3 151.4" fill="none" stroke="#222" strokeWidth="1.5" />

            {/* Mask for central banner to clip the inner and outer circles at the equator */}
            <rect x="0" y="81" width="200" height="38" fill="#fff" />

            {/* Horizontal Banner lines */}
            <line x1="12" y1="81" x2="188" y2="81" stroke="#222" strokeWidth="1.5" />
            <line x1="12" y1="119" x2="188" y2="119" stroke="#222" strokeWidth="1.5" />

            {/* Central Text */}
            <text x="100" y="105" fontFamily="'Inter', sans-serif" fontSize="15" textAnchor="middle" fontWeight="400" fill="#222" letterSpacing="1.5">QC CAREER SCHOOL</text>

            {/* Inner labels */}
            <text x="100" y="66" fontFamily="'Inter', sans-serif" fontSize="16" textAnchor="middle" fontWeight="400" fill="#222" letterSpacing="2">EST.</text>
            <text x="100" y="146" fontFamily="'Inter', sans-serif" fontSize="16" textAnchor="middle" fontWeight="400" fill="#222" letterSpacing="3">1984</text>

            {/* Curved Texts */}
            <text fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="400" fill="#222" letterSpacing="2.5">
              <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">CERTIFICATE</textPath>
            </text>
            <text fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="400" fill="#222" letterSpacing="2">
              <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">OF COMPLETION</textPath>
            </text>
          </svg>
        </div>

        {/* 7.3 RIGHT COLUMN (Student Support Executive Section) */}
        <div
          style={{
            position: 'absolute',
            left: '736px',
            top: '715px',
            width: '240px',
          }}
        >
          {/* Dynamic Signature */}
          {directorSignatureUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={directorSignatureUrl}
              alt="Director Signature"
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '80px',
                width: 'auto',
                maxHeight: '144%',
                objectFit: 'contain',
              }}
            />
          )}
          {/* Signatory line */}
          <div style={{ height: '1px', backgroundColor: '#000000', width: '100%' }} />
          {/* Identity text label */}
          <div
            className="text-meta-subtext"
            style={{
              marginTop: '11px',
              width: '100%',
              textAlign: 'center',
              fontSize: '10px',
            }}
          >
            DIRECTOR OF STUDENT SUPPORT
          </div>
        </div>

      </div>
    </div>
  );
}
