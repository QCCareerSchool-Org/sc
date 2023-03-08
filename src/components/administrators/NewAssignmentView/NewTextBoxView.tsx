import type { FC } from 'react';
import { Fragment } from 'react';

import type { WithInputForm } from './state';
import type { NewTextBox } from '@/domain/administrator/newTextBox';

type Props = {
  textBox: WithInputForm<NewTextBox>;
};

const lineHeight = 24;
const padding = 14;

export const NewTextBoxView: FC<Props> = ({ textBox }) => {
  const minHeight = (lineHeight * (textBox.lines ?? 4)) + padding;
  return (
    <div className="row" id={textBox.textBoxId}>
      {textBox.description && <label className="form-label">{textBox.description}</label>}
      <div className="col-12 col-lg-8 textBoxColumn">
        <div className="form-control" style={{ minHeight }}>{textBox.text.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => {
          if (i === 0) {
            return <Fragment key={i}>{p}</Fragment>;
          }
          return <Fragment key={i}><br /><br />{p}</Fragment>;
        })}</div>
      </div>
    </div>
  );
};
