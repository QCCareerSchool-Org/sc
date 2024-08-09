import type { FC } from 'react';
import { Fragment } from 'react';

import type { WithInputForm } from './state';
import type { NewTextBox } from '@/domain/tutor/newTextBox';

type Props = {
  newTextBox: WithInputForm<NewTextBox>;
  modified: boolean;
  submissionIsRedo: boolean;
};

const lineHeight = 24;
const padding = 14;

const possibleYouTubeLink = /https:\/\/(?:.*\.)?youtube\.com/ui;
const goodYouTubeLink = /^https:\/\/www\.youtube\.com\/watch\?v=(?:[a-zA-Z0-9_-]){11,}/u;
const youtubeShortLink = /https:\/\/youtube.com\/shorts\/([a-zA-Z0-9_-]{11,})/ui;

export const TextBox: FC<Props> = ({ newTextBox, modified, submissionIsRedo }) => {
  const minHeight = (lineHeight * (newTextBox.lines ?? 3)) + padding;

  const malformedYouTubeLink = possibleYouTubeLink.test(newTextBox.text) && !goodYouTubeLink.test(newTextBox.text);
  const parts = youtubeShortLink.exec(newTextBox.text);
  const videoId = parts ? parts[1] : null;

  return (
    <div className="row" id={newTextBox.textBoxId}>
      {newTextBox.description && <label className="form-label">{newTextBox.description}</label>}
      <div className="col-12 col-lg-8 textBoxColumn">
        <div className="form-control" style={{ minHeight }}>{newTextBox.text.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => {
          if (i === 0) {
            return <Fragment key={i}>{p}</Fragment>;
          }
          return <Fragment key={i}><br /><br />{p}</Fragment>;
        })}</div>
        {submissionIsRedo && modified && <div className="fw-bold text-danger">(CHANGED)</div>}
        {malformedYouTubeLink && (
          <div>({videoId
            ? <>This appears to be a link to a YouTube Short. You can use the video ID specified and instead visit <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v={videoId}</a></>
            : <>This appears to be a non-standard YouTube link. You can examine the link to find the 8-digit video ID and instead visit https://www.youtube.com/watch?v=&lt;videoId&gt;</>
          })</div>
        )}
      </div>
    </div>
  );
};
