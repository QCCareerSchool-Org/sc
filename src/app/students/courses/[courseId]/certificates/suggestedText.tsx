'use client';

import type { FC, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';

interface Params {
  text: string;
}

export const SuggestedText: FC<Params> = ({ text }) => {
  const [ clicks, setClicks ] = useState(0);

  useEffect(() => {
    if (!clicks) {
      return;
    }
    const id = setTimeout(() => setClicks(0), 1000);
    return () => clearTimeout(id);
  }, [ clicks ]);

  const handleTextAreaClick: MouseEventHandler<HTMLTextAreaElement> = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setClicks(c => (c === Number.MAX_SAFE_INTEGER ? 1 : c + 1));
    });
  };

  return (
    <>
      <textarea onClick={handleTextAreaClick} className="form-control" readOnly rows={4} style={{ resize: 'none', marginBottom: '0.25rem', borderRadius: '0.5rem' }} value={text} />
      <div style={{ height: '1rem' }}>
        {clicks > 0 && <small style={{ textTransform: 'uppercase' }}>Text Copied!</small>}
      </div>
    </>
  );
};
