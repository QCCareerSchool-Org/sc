'use client';

import type { FC } from 'react';
import { useState } from 'react';

import { handleDownloadPDF } from './handlePDFDownload';
import styles from './index.module.css';

interface Props {
  name: string;
}

export const DownloadPDFButton: FC<Props> = ({ name }) => {
  const [ isGenerating, setIsGenerating ] = useState(false);
  const handleClick = () => {
    void handleDownloadPDF(name, setIsGenerating);
  };

  return (
    <button
      className={`btn btn-primary ${styles.blackBtn}`}
      onClick={handleClick}
      disabled={isGenerating}
    >
      {isGenerating ? 'Generating...' : 'Download Official PDF'}
    </button>
  );

};
