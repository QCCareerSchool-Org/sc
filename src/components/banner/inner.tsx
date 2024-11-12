import type { CSSProperties, FC } from 'react';

type Props = {
  backgroundColor: CSSProperties['backgroundColor'];
  desktopSrc: string;
  mobileSrc: string;
  url: string;
};

export const Inner: FC<Props> = props => (
  <div style={{ backgroundColor: props.backgroundColor, textAlign: 'center', position: 'relative', flexGrow: 0 }}>
    <div className="container p-0">
      <a href={props.url} target="_blank" rel="noreferrer">
        <div className="d-none d-sm-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={props.desktopSrc} alt="" className="img-fluid" style={{ width: '100%' }} />
        </div>
        <div className="d-sm-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={props.mobileSrc} alt="" className="img-fluid" style={{ width: '100%' }} />
        </div>
      </a>
    </div>
  </div>
);
