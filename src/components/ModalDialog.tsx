import type { FC, PropsWithChildren } from 'react';

type Props = {
  title: string;
  onClose: () => void;
};

export const ModalDialog: FC<PropsWithChildren<Props>> = props => (
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{props.title}</h5>
        <button onClick={props.onClose} type="button" className="btn-close" aria-label="Close" />
      </div>
      <div className="modal-body">
        {props.children}
      </div>
    </div>
  </div>
);
