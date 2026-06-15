'use client';

import type { FC } from 'react';
import { useState } from 'react';

import styles from './ActionsSection.module.css';
import { handleDownload } from '@/components/certificate/handleDownload';

export const DownloadButton: FC = () => {
  const [ isGenerating, setIsGenerating ] = useState(false);

  const handleClick = () => {
    setIsGenerating(true);
    void handleDownload().finally(() => {
      setIsGenerating(false);
    });
  };

  return (
    <button className={`btn btn-primary ${styles.blackBtn}`} onClick={handleClick} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Download Official PDF'}
    </button>
  );

};
