import type { ChangeEventHandler } from 'react';
import { useId } from 'react';
import { FaBookmark, FaClock, FaLightbulb, FaPlayCircle } from 'react-icons/fa';

import { MaterialButton } from './MaterialButton';
import type { MaterialWithCompletionForm } from './state';
import { useScreenWidth } from '@/hooks/useScreenWidth';

type Props = {
  material: MaterialWithCompletionForm;
  complete: boolean;
  onCompleteChange: ChangeEventHandler<HTMLInputElement>;
  href: string;
};

export const LessonStats: React.FC<Props> = props => {
  const id = useId();
  const screenWidth = useScreenWidth();
  const lg = screenWidth >= 992 && screenWidth < 1200;

  return (
    <div>
      <div className="minutes"><div className="icon minutesIcon"><FaClock size={16} /></div> <span>{props.material.minutes} {lg ? 'min.' : 'minutes'} to complete</span></div>
      <ul className="statsList">
        {props.material.chapters !== null && props.material.chapters > 0 && <li><span className="icon"><FaBookmark /></span><strong>{props.material.chapters}</strong> Chapters</li>}
        {props.material.videos !== null && props.material.videos > 0 && <li><span className="icon"><FaPlayCircle /></span><strong>{props.material.videos}</strong> Instructional Videos</li>}
        {props.material.knowledgeChecks !== null && props.material.knowledgeChecks > 0 && <li><span className="icon"><FaLightbulb /></span><strong>{props.material.knowledgeChecks}</strong> Knowledge Checks</li>}
      </ul>
      <a className="lessonButtonLink" href={props.href} target="_blank" rel="noopener noreferrer"><MaterialButton type="lesson">View Lesson</MaterialButton></a>
      <div className="form-check">
        <input onChange={props.onCompleteChange} checked={props.complete} className="form-check-input" type="checkbox" id={id} disabled={props.material.processingState === 'processing'} />
        <label className="form-check-label labelText" htmlFor={id}>
          Click here when you have completed your lesson.
        </label>
      </div>
      <style jsx>{`
      .minutes {
        display: flex;
        background-color: rgb(128, 128, 128);
        color: white;
        padding: 0.25rem 0 0.25rem 0.75rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        text-align: center;
      }
      .minutesIcon {
        position: relative;
        top: -0.0625rem;
      }
      .statsList {
        list-style: none;
        margin: 0 0 0.75rem 1rem;
        padding: 0;
        font-size: 0.875rem;
      }
      .lessonButtonLink {
        text-decoration: none;
      }
      .labelText {
        font-size: 0.75rem;
        line-height: 1rem;
        padding-top: 0.25rem;
      }
      .icon {
        margin-right: 0.375rem;
      }
      `}</style>
    </div>
  );
};
