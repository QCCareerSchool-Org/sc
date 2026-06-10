import type { FC } from 'react';

export const Seal: FC = () => (
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
);
