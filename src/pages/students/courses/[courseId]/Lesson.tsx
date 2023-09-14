import type { ChangeEventHandler, FC } from 'react';
import { useId } from 'react';
import { FaClock } from 'react-icons/fa';
import type { Subject } from 'rxjs';

import { LessonBorder } from './LessonBorder';
import { MaterialButton } from './MaterialButton';
import type { MaterialWithCompletionForm } from './state';
import { UnitAccordionSectionPadding } from './UnitAccordionSectionPadding';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import { Img } from '@/components/Img';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  enrollmentId: number;
  material: MaterialWithCompletionForm;
  complete: boolean;
  materialCompletion$: Subject<MaterialCompleteEvent>;
  last: boolean;
};

export const Lesson: FC<Props> = ({ studentId, enrollmentId, material, complete, materialCompletion$, last }) => {
  const id = useId();
  const screenwidth = useScreenWidth();
  const md = screenwidth >= 768;
  const lg = screenwidth >= 992;
  const xl = screenwidth >= 1200;

  const handleCompleteChange: ChangeEventHandler<HTMLInputElement> = e => {
    materialCompletion$.next({
      studentId,
      enrollmentId,
      materialId: material.materialId,
      processingState: material.processingState,
      complete: e.target.checked,
    });
  };

  const href = `${endpoint}/students/${studentId}/static/lessons/${material.materialId}${material.entryPoint}`;
  const imageSrc = `${endpoint}/students/${studentId}/materials/${material.materialId}/image`;
  return (
    <>
      <LessonBorder complete={complete} last={last}>
        <UnitAccordionSectionPadding>
          <div className="row">
            <div className="col-12 col-lg-4 col-xxl-3 mb-3 mb-lg-0">
              <div className="thumbnailWrapper">
                <a href={href} target="_blank" rel="noopener noreferrer" className="thumbnail">
                  <Img src={imageSrc} className="img-fluid rounded-4 shadow" alt="image" />
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-8 col-xxl-9 d-flex">
              <div className={`d-flex flex-column flex-grow-1 justify-content-between ${xl ? 'py-4' : lg ? 'py-2' : ''}`}>
                <div>
                  <h4 className="title h6 mb-2">{material.title}</h4>
                  <p className="small mb-2 description">{material.description}</p>
                  <div className="minutes"><div className="minutesIcon"><FaClock size={12} /></div> <span className="small"><span className="fw-bold">{material.minutes} min</span> to complete</span></div>
                </div>
                <div className={md ? 'd-flex justify-content-between' : ''}>
                  <div className={md ? '' : 'mb-3'}>
                    <a className="lessonButtonLink" href={href} target="_blank" rel="noopener noreferrer"><MaterialButton>View Lesson</MaterialButton></a>
                  </div>

                  <div className={`form-check round ${md ? 'right' : ''}`}>
                    <input onChange={handleCompleteChange} checked={complete} className="form-check-input" type="checkbox" id={id} disabled={material.processingState === 'processing'} />
                    <label className="form-check-label small fw-bold" htmlFor={id}>
                      Click here when you have completed your lesson
                    </label>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </UnitAccordionSectionPadding>
      </LessonBorder>
      <style jsx>{`
      .description {
        color: #777;
      }
      .form-check.round .form-check-input {
        width: 1.25em;
        height: 1.25em;
        border-radius: 0.625em;
        margin-top: 0.1875em;
      }
      .form-check.round .form-check-input:checked {
        background-color: #2dcb70;
        border-color: #2dcb70;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5.5 10 3 3 6-6'/%3e%3c/svg%3e")
      }
      .form-check.right {
        padding-left: 0;
        padding-right: 1.625em;
        text-align: end;
      }
      .form-check.right .form-check-input {
        float: right;
        margin-left: 0;
        margin-right: -1.625em;       
      }
      .form-check.right .form-check-label {
        text-align: end;
      }
      @media screen only and (max-width: 991px) {
        .thumbnailWrapper {
          max-width: 300px;
          margin: 0 auto 0 0;
        }
      }
      @media (min-width: 992px) {
        .title {
           font-size: 1.25rem;
        }
      }
      @media (min-width: 1400px) {
        .title {
           font-size: 1.25rem;
        }
      }
      .minutes {
        display: flex;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        text-align: center;
        font-weight: 500;
      }
      .minutesIcon {
        position: relative;
        top: -0.1875rem;
        margin-right: 0.375rem;
      }
      `}</style>
    </>
  );
};
