import type { FC } from 'react';
import { Fragment } from 'react';

import type { WithInputForm } from './state';
import type { NewTextBox } from '@/domain/tutor/newTextBox';
import { parseYouTubeURL } from 'src/lib/parseYouTubeURL';

type Props = {
  newTextBox: WithInputForm<NewTextBox>;
  modified: boolean;
  submissionIsRedo: boolean;
};

const lineHeight = 24;
const padding = 14;

export const TextBox: FC<Props> = ({ newTextBox, modified, submissionIsRedo }) => {
  const minHeight = (lineHeight * (newTextBox.lines ?? 3)) + padding;

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
        <YouTubeMessage text={newTextBox.text} />
      </div>
    </div>
  );
};

const YouTubeMessage: FC<{ text: string }> = ({ text }) => {
  const stats = parseYouTubeURL(text);

  if (!stats.isYouTube) {
    return null;
  }

  if (stats.isCorrect) {
    return <strong>This is a YouTube link. You can watch it at <a href={text} target="_blank" rel="noopener noreferrer">{text}</a></strong>;
  }

  if (stats.videoId) {
    const url = `https://www.youtube.com/watch?v=${stats.videoId}`;
    return <strong>This is a YouTube link, but not in the expected format. You can use the video ID <span className="text-info font-monospace">{stats.videoId}</span> specified in the link to visit <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></strong>;
  }

  return <strong>This appears to be a non-standard YouTube link. Examine the link to find the 11-digit video ID made up of letters, numbers, underscores (_) and hyphens (-), and instead visit https://www.youtube.com/watch?v=<span className="fst-italic">&lt;videoId&gt;</span></strong>;
};
