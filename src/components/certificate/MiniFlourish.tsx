import type { FC } from 'react';

export const MiniFlourish: FC = () => (
  <svg className="w-14 h-4" style={{ color: '#404040' }} viewBox="0 0 80 20" fill="currentColor">
    <path d="M40 5 C43 10, 48 12, 53 10 C54 11, 54 12, 52 13 C49 15, 44 13, 40 10 C36 13, 31 15, 28 13 C26 12, 26 11, 27 10 C32 12, 37 10, 40 5 Z" />
    <circle cx="40" cy="5" r="1.2" />
    <path d="M15 10 C20 10, 25 8, 28 10 C29 11, 28 12, 26 12 C22 12, 18 10, 15 10 Z" opacity="0.5" />
    <path d="M65 10 C60 10, 55 8, 52 10 C51 11, 52 12, 54 12 C58 12, 62 10, 65 10 Z" opacity="0.5" />
  </svg>
);
