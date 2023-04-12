import type { FC } from 'react';
import { useId } from 'react';

import type { WithInputForm } from './state';
import { Img } from '@/components/Img';
import type { NewUploadSlot } from '@/domain/administrator/newUploadSlot';
import { endpoint } from 'src/basePath';

type Props = {
  administratorId: number;
  uploadSlot: WithInputForm<NewUploadSlot>;
};

export const NewUploadSlotView: FC<Props> = ({ administratorId, uploadSlot }) => {
  const id = useId();
  const useableId = id.replaceAll(':', '_');

  const src = `${endpoint}/administrators/${administratorId}/newUploadSlots/${uploadSlot.uploadSlotId}/file`;

  return (
    <div className="row" id={uploadSlot.uploadSlotId}>
      <label className="form-label">{uploadSlot.label}:</label>
      <div className="col-12 col-lg-8 uploadSlotColumn">
        {uploadSlot.mimeTypeId?.startsWith('image/')
          ? (
            <>
              <button className="btn btn-link p-0 uploadSlotThumbnail" data-bs-toggle="modal" data-bs-target={`#uploadSlot_modal${useableId}`}>
                <Img className="w-100" src={src} alt={uploadSlot.label} />
              </button>
              <div className="modal" tabIndex={-1} id={`uploadSlot_modal${useableId}`} aria-labelledby={`uploadSlot_modalTitle${useableId}`} aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id={`uploadSlot_modalTitle${useableId}`}>{uploadSlot.label}</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body d-flex align-items-center justify-content-center">
                      <Img className="w-100" src={src} alt={uploadSlot.label} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
          : <div><a href={src} download>{uploadSlot.filename}</a></div>
        }
      </div>
      <style jsx>{`
      .uploadSlotThumbnail { max-width: 180px; }
      `}</style>
    </div>
  );
};
