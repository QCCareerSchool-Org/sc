import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';
import type { MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';

import { ScormAPI } from 'src/lib/scorm';

declare const qcWindowOpen: (url: string, target?: string) => WindowProxy;

type Props = {
  lessonId: string | null;
};

const LessonPage: NextPage<Props> = ({ lessonId }) => {
  const authState = useAuthState();

  const scormAPI = useRef<ScormAPI>();

  const childWindow = useRef<Window | null>(null);

  const ready = useState(false);

  const commit = useRef((data: Record<string, string>): boolean => {
    for (const [ element, value ] of Object.entries(data)) {
      window.localStorage.setItem(`${lessonId}.${element}`, value);
    }
    return true;
  });

  useEffect(() => {
    if (scormAPI.current) {
      return;
    }

    if (!lessonId) {
      return;
    }

    const data: Record<string, string> = {};
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(`${lessonId}.`)) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          data[key] = value;
        }
      }
    }

    scormAPI.current = new ScormAPI(lessonId, commit.current, data);
    window.API_1484_11 = scormAPI.current;
  }, [ lessonId ]);

  useEffect(() => {
    const listener = (): void => {
      if (childWindow.current) {
        childWindow.current.close();
      }
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, []);

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (lessonId === null) {
    return <ErrorPage statusCode={400} />;
  }

  if (!ready) {
    return null;
  }

  const handleClick: MouseEventHandler = () => {
    const url = `/api/sc/v1/students/50/static/lessons/${lessonId}/scormdriver/indexAPI.html`;
    childWindow.current = window.open(url, lessonId ?? '_blank');
  };

  const handleClick2: MouseEventHandler = () => {
    const url = `/api/sc/v1/students/50/static/lessons/${lessonId}/scormdriver/indexAPI.html`;
    childWindow.current = qcWindowOpen(url, lessonId ?? '_blank');
  };

  return (
    <section>
      <div className="container">
        <h1>Test {lessonId}</h1>
        <button onClick={handleClick} className="btn btn-primary">Open Lesson</button>
        <button onClick={handleClick2} className="btn btn-primary">Open Lesson 2</button>
        <a href={`/api/sc/v1/students/50/static/lessons/${lessonId}/scormdriver/indexAPI.html`} target={lessonId ?? '_blank'}>Open Lesson Link</a>
      </div>
    </section>
  );
};

export default LessonPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const lessonIdParam = ctx.params?.lessonId;
  const lessonId = typeof lessonIdParam === 'string' ? lessonIdParam : null;
  return { props: { lessonId } };
};
