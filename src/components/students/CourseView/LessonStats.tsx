import type { ChangeEventHandler } from 'react';
import { useId } from 'react';
import { FaBookmark, FaBookOpen, FaClock, FaLightbulb, FaPlayCircle } from 'react-icons/fa';

import type { MaterialWithCompletionForm } from './state';
import { useScreenWidth } from '@/hooks/useScreenWidth';

type Props = {
  material: MaterialWithCompletionForm;
  complete: boolean;
  onCompleteChange: ChangeEventHandler<HTMLInputElement>;
};

export const LessonStats: React.FC<Props> = props => {
  const id = useId();
  const screenWidth = useScreenWidth();
  const lg = screenWidth >= 992 && screenWidth < 1200;

  return (
    <div>
      <div className="minutes"><div className="icon minutesIcon"><FaClock size={16} /></div> <span>{props.material.minutes} {lg ? 'min.' : 'minutes'} to complete</span></div>
      <ul className="statsList">
        {props.material.chapters && <li><span className="icon"><FaBookmark /></span><strong>{props.material.chapters}</strong> Chapters</li>}
        {props.material.videos && <li><span className="icon"><FaPlayCircle /></span><strong>{props.material.videos}</strong> Intructional Videos</li>}
        {props.material.knowledgeChecks && <li><span className="icon"><FaLightbulb /></span><strong>{props.material.knowledgeChecks}</strong> Knowledge Checks</li>}
      </ul>
      <a className="lessonButtonLink" href=""><div className="lessonButton"><span className="icon"><FaBookOpen /></span>View Lesson</div></a>
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
      .icon {
        margin-right: 0.375rem;
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
      .lessonButton {
        background-color: black;
        color: white;
        text-align: center;
        padding: 0.375rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
      }
      .labelText {
        font-size: 0.75rem;
        line-height: 1rem;
        padding-top: 0.25rem;
      }
      `}</style>
    </div>
  );
};
