import type { ChangeEventHandler, FC, MouseEventHandler, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { FaRegMinusSquare, FaRegPlusSquare } from 'react-icons/fa';

import type { Subject } from 'rxjs';
import { LessonStats } from './LessonStats';
import type { MaterialWithCompletionForm } from './state';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import { Img } from '@/components/Img';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  enrollmentId: number;
  material: MaterialWithCompletionForm;
  complete: boolean;
  materialCompletion$: Subject<MaterialCompleteEvent>;
};

export const Lesson: FC<Props> = ({ studentId, enrollmentId, material, complete, materialCompletion$ }) => {
  const descriptionBox = useRef<HTMLDivElement>(null);
  const [ expansion, setExpansion ] = useState(false);
  const [ expanded, setExpanded ] = useState(false);

  useEffect(() => {
    if (descriptionBox.current === null) {
      return;
    }
    const element = descriptionBox.current;
    const handleResize = (): void => {
      // setExpanded(false);
      setExpansion(element.offsetHeight < element.scrollHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExpansionClick: MouseEventHandler = (): void => {
    setExpanded(e => !e);
  };

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
      <LessonBorder complete={complete}>
        <div className="row py-4">
          <div className="col-12 col-lg-4 col-xxl-3 mb-3 mb-lg-0">
            <div className="thumbnailWrapper">
              <a href={href} target="_blank" rel="noopener noreferrer" className="thumbnail">
                <Img src={imageSrc} className="img-fluid rounded-4 shadow" alt="image" />
              </a>
            </div>
          </div>
          <div className={`col-12 col-lg-5 col-xxl-6 mb-3 mb-lg-0 position-relative ${expanded ? '' : 'overflow-hidden'}`}>
            <div ref={descriptionBox} className={`${expanded ? '' : 'description'}`}>
              <h4 className="title h6 mb-2">{material.title}</h4>
              <p className="small mb-0">{material.description}</p>
            </div>
            {(expansion || expanded) && <button onClick={handleExpansionClick} className={`moreLink ${expanded ? 'expanded' : 'collapsed'} link-secondary text-decoration-none d-none d-lg-block btn btn-link btn-sm p-0 w-100 cursor-pointed small text-end`}>{expanded ? <><FaRegMinusSquare /> show less</> : <><FaRegPlusSquare /> show more</>}</button>}
          </div>
          <div className="col-8 col-sm-6 col-md-5 col-lg-3">
            {material.type === 'lesson' && <LessonStats material={material} complete={complete} onCompleteChange={handleCompleteChange} href={href} />}
          </div>
        </div>
      </LessonBorder>
      <style jsx>{`
      .moreLink {
        border: none;
        bottom: -3px !important;
      }
      .moreLink.expanded {
      }
      .moreLink.collapsed {
        position: absolute;
        bottom: 0;
        right: 0;
        padding-top: 3rem !important;
        background: ${complete ? 'linear-gradient(rgba(232, 255, 239, 0.1), rgba(232, 255, 239, 1) 67%)' : 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1) 67%)'};
      }
      @media screen only and (max-width: 991px) {
        .thumbnailWrapper {
          max-width: 300px;
          margin: 0 auto 0 0;
        }
      }
      @media screen only and (min-width: 992px) {
        .description {
          height: 193px;
        }
      }
      @media screen only and (min-width: 1200px) {
        .description {
          height: 233px;
        }
      }
      @media screen only and (min-width: 1400px) {
        .description {
          height: 200px;
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
      `}</style>
    </>
  );
};

type LessonBorderProps = {
  complete: boolean;
  children: ReactNode;
};

const LessonBorder: FC<LessonBorderProps> = ({ complete, children }) => (
  <div className="container" style={complete ? { backgroundColor: 'rgb(232, 255, 239)' } : {}}>
    {children}
  </div>
);
