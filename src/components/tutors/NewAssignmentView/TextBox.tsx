import type { FC } from 'react';
import { Fragment } from 'react';

import type { WithInputForm } from './state';
import type { NewTextBox } from '@/domain/newTextBox';

type Props = {
  newTextBox: WithInputForm<NewTextBox>;
};

const lineHeight = 24;
const padding = 14;

export const TextBox: FC<Props> = ({ newTextBox }) => {
  const minHeight = (lineHeight * (newTextBox.lines ?? 4)) + padding;
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
      </div>
    </div>
  );
};
