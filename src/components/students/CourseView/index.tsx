import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, MouseEvent, MouseEventHandler, SyntheticEvent } from 'react';
import { Fragment, useCallback, useMemo, useReducer, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { MdAssignmentTurnedIn, MdCollectionsBookmark, MdListAlt, MdMovie, MdPolicy } from 'react-icons/md';

import { certificationDataDictionary } from './certificationData';
import { CertificationLogoSection } from './CertificationLogoSection';
import { CourseHeaderImage } from './CourseHeaderImage';
import { CourseVideo } from './CourseVideo';
import { initialState, reducer } from './state';
import { SubmissionsTable } from './SubmissionsTable';
import { UnitAccordion } from './UnitAccordion';
import { useInitialData } from './useInitialData';
import { useInitializeNextUnit } from './useInitializeNextUnit';
import { useMaterialCompletion } from './useMaterialCompletion';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { useStayLoggedIn } from '@/hooks/useStayLoggedIn';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

type Props = {
  studentId: number;
  courseId: number;
};

export const CourseView: FC<Props> = ({ studentId, courseId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const [ playingVideoId, setPlayingVideoId ] = useState<string>();

  // we're going to be linking to static resources that require the user to be
  // logged in, and those resources don't have a refresh mechanism
  useStayLoggedIn();

  useInitialData(dispatch, studentId, courseId);
  const materialCompletion$ = useMaterialCompletion(dispatch);

  const initializeNextUnit$ = useInitializeNextUnit(dispatch);

  const handleNewUnitClick = useCallback((e: MouseEvent<HTMLTableRowElement>, submissionId: string): void => {
    void router.push(`/students/courses/${courseId}/submissions/${submissionId}`);
  }, [ router, courseId ]);

  const nextUnit = useMemo(() => getNextUnit(state.enrollment), [ state.enrollment ]);

  const hasVideos = useMemo(() => state.enrollment?.course.units.some(u => u.videos.length > 0), [ state.enrollment?.course.units ]);
  // const hasResources = useMemo(() => state.enrollment?.course.units.some(u => u.videos.length > 0), [ state.enrollment?.course.units ]);
  const hasResources = false;

  const certificationData = useMemo(() => (state.enrollment?.course.code ? certificationDataDictionary[state.enrollment.course.code] : undefined), [ state.enrollment?.course.code ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.enrollment) {
    return (
      <>
        <Section>
          <CourseHeaderImage courseId={courseId} />
          <div className="container text-white" style={{ minHeight: 240 }} aria-hidden="true">
            <div className="row">
              <div className="col-12 col-lg-6">
                <h1 className="mb-0 placeholder-glow"><span className="placeholder col-8" /></h1>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
              </div>
              <div className="col-12 col-lg-6">
                <h2 className="h4 placeholder-glow"><span className="placeholder col-6" /></h2>
                <div className="placeholder-glow mb-4" style={{ height: 80 }}><span className="placeholder col-12 h-100" /></div>
                <button className="btn btn-primary disabled placeholder" style={{ width: 120 }} />
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="container" aria-hidden="true" />
        </Section>
      </>
    );
  }

  if (state.enrollment.course.submissionType !== 1) {
    // courses with the old system should use the old page
    window.location.href = `/students/course-materials/new.bs.php?course_id=${courseId}`;
    return null;
  }

  const handleInitializeButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    initializeNextUnit$.next({
      processingState: state.form.processingState,
      studentId,
      courseId,
    });
  };

  const enrollmentId = state.enrollment.enrollmentId;
  const materialCompletions = state.enrollment.materialCompletions;

  const handleVideoPlay = (e: SyntheticEvent<HTMLVideoElement, Event>, videoId: string): void => {
    setPlayingVideoId(videoId);
  };

  return (
    <>
      <Section>
        <CourseHeaderImage courseId={courseId} />
        <div className="container text-white" style={{ minHeight: 240 }}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <h1 className="mb-0 mb-2 text-shadow">{state.enrollment.course.name}</h1>
              <p className="lead mb-0 text-shadow">Student Number: <strong>{state.enrollment.course.code}&thinsp;{state.enrollment.studentNumber}</strong></p>
              {state.enrollment.tutor && <p className="lead mb-0 text-shadow">Tutor: <strong>{state.enrollment.tutor.firstName} {state.enrollment.tutor.lastName}</strong></p>}
              {state.enrollment.course.school.name === 'QC Pet Studies' && (
                <div className="mt-4">
                  <Link href="/student-handbooks/qc-pet-studies/content/index.html"><a target="_blank" rel="noreferrer"><button className="btn btn-lg btn-red">Student Handbook <FaDownload /></button></a></Link>
                </div>
              )}
              <div className="mt-5">
                <p className="lead mb-0 text-shadow"><MdCollectionsBookmark /> <a href="#materials" style={{ textDecoration: 'none' }} className="text-white">Course Materials</a></p>
                {hasResources && <p className="lead mb-0 text-shadow"><MdListAlt /> <a href="#resources" style={{ textDecoration: 'none' }} className="text-white">Resources</a></p>}
                {hasVideos && <p className="lead mb-0 text-shadow"><MdMovie /> <a href="#videos" style={{ textDecoration: 'none' }} className="text-white">Videos</a></p>}
                {certificationData && <p className="lead mb-0 text-shadow"><MdPolicy /> <a href="#certification" style={{ textDecoration: 'none' }} className="text-white">Certification Logo</a></p>}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <p id="assignments" className="lead mb-2 text-shadow menuScrollOffset"><MdAssignmentTurnedIn /> Assignments</p>
              <SubmissionsTable newSubmissions={state.enrollment.newSubmissions} onNewUnitClick={handleNewUnitClick} />
              {nextUnit.success
                ? (
                  <div className="d-flex align-items-center">
                    <button onClick={handleInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }}>
                      {state.form.processingState === 'initializing'
                        ? <Spinner size="sm" />
                        : <>Start Unit {nextUnit.unitLetter}</>
                      }
                    </button>
                    {state.form.processingState === 'initialize error' && <span className="text-danger ms-2">{state.form.errorMessage ?? 'initializing'}</span>}
                  </div>
                )
                : <NextUnitMessage nextUnit={nextUnit} />
              }
            </div>
          </div>
        </div>
      </Section>
      <Section id="materials">
        <div className="container">
          <h2>Course Materials</h2>
          {state.enrollment.course.units.length > 0 && (
            <>
              {state.enrollment.course.units.map((u, i) => (
                <UnitAccordion
                  key={u.unitId}
                  studentId={studentId}
                  enrollmentId={enrollmentId}
                  courseId={courseId}
                  unit={u}
                  materialCompletions={materialCompletions}
                  materialCompletion$={materialCompletion$}
                  firstUnit={i === 0}
                />
              ))}
            </>
          )}
        </div>
      </Section>
      {hasResources && (
        <Section id="resources">
          <div className="container">
            <h2>Videos</h2>
          </div>
        </Section>
      )}
      {hasVideos && (
        <Section id="videos">
          <div className="container">
            <h2>Videos</h2>
            <p className="lead">You can re-watch your course videos below.</p>
            {state.enrollment.course.units.map(u => {
              if (u.videos.length === 0) {
                return null;
              }
              return (
                <Fragment key={u.unitId}>
                  <h3 className="h5">Unit {u.unitLetter}</h3>
                  <div className="row mb-2">
                    {u.videos.map(v => (
                      <div key={v.videoId} className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4">
                        <CourseVideo videoId={v.videoId} src={v.src} posterSrc={v.posterSrc} captionSrc={v.captionSrc} playingVideoId={playingVideoId} onPlay={handleVideoPlay} />
                        {/* <VideoComponent controls src={v.src} poster={v.posterSrc} captionSrc={v.captionSrc ?? undefined} style={{ width: '100%' }} /> */}
                        {v.title}
                      </div>
                    ))}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
      {certificationData && <CertificationLogoSection certificationData={certificationData} graduated={state.enrollment.graduated} />}
    </>
  );
};

type NextUnitResult = {
  success: true;
  unitLetter: string;
} | {
  success: false;
  error: 'loading' | 'arrears' | 'on hold' | 'incomplete' | 'disabled' | 'complete';
};

type NextUnitMessageProps = {
  nextUnit: NextUnitResult;
};

const NextUnitMessage: FC<NextUnitMessageProps> = ({ nextUnit }) => {
  if (nextUnit.success) {
    return null;
  }
  switch (nextUnit.error) {
    case 'loading':
      return null;
    case 'arrears':
      return <p>Account is in arrears. Please contact the school.</p>;
    case 'on hold':
      return <p>Account is on hold. Please contact the school.</p>;
    case 'incomplete':
      return null;
    case 'disabled':
      return <div className="alert alert-warning">This course is undergoing maintenance. Please check back in a few minutes.</div>;
    case 'complete':
      return <p>Assignments complete!</p>;
  }
};

const getNextUnit = (enrollment?: EnrollmentWithStudentCourseAndUnits): NextUnitResult => {
  if (!enrollment) {
    return { success: false, error: 'loading' };
  }

  if (enrollment.student.arrears) {
    return { success: false, error: 'arrears' };
  }

  if (enrollment.onHold) {
    return { success: false, error: 'on hold' };
  }

  // make sure there are no open (unskipped or unmarked) units
  if (!enrollment.newSubmissions.every(u => u.skipped || u.closed)) {
    return { success: false, error: 'incomplete' };
  }

  if (!enrollment.course.submissionsEnabled) {
    return { success: false, error: 'disabled' };
  }

  const sortedSubmissionTemplates = enrollment.course.newSubmissionTemplates.sort((a, b) => {
    if (a.order === b.order) {
      return a.unitLetter.localeCompare(b.unitLetter);
    }
    return a.order - b.order;
  });
  for (const t of sortedSubmissionTemplates) {
    if (!enrollment.newSubmissions.some(u => u.unitLetter === t.unitLetter)) {
      return { success: true, unitLetter: t.unitLetter };
    }
  }
  return { success: false, error: 'complete' };
};
