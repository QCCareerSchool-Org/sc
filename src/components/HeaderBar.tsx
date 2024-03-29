import type { FC } from 'react';

export const HeaderBar: FC = () => (
  <>
    <div id="headerBar">
      <div className="container">
        <small>Call Us Toll Free: <strong>1-833-600-3751</strong></small>
      </div>
    </div>

    <style jsx>{`
      #headerBar {
        background: #e10019;
        background: linear-gradient(to right, #e10019, #b70404);
        color: white;
        padding: 0.1875rem 0;
      }
    `}</style>
  </>
);
