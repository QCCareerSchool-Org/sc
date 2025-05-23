import NextError from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { FC, MouseEvent, MouseEventHandler, SyntheticEvent } from 'react';
import { Fragment, useCallback, useMemo, useReducer, useState } from 'react';
import { MdAssignmentTurnedIn, MdCollectionsBookmark, MdListAlt, MdMovie, MdMusicNote, MdPolicy } from 'react-icons/md';

import { certificationDataDictionary } from './certificationData';
import { CertificationLogoSection } from './CertificationLogoSection';
import { CourseHeaderImage } from './CourseHeaderImage';
import { CourseProgress } from './CourseProgress';
import { CourseVideo } from './CourseVideo';
import EWLogo from './ew-logo-white.svg';
import { HandbookButton } from './HandbookButton';
import { initialState, reducer } from './state';
import { SubmissionsTable } from './SubmissionsTable';
import { UnitAccordion } from './UnitAccordion';
import { useInitialData } from './useInitialData';
import { useInitializeNextUnit } from './useInitializeNextUnit';
import { useMaterialCompletion } from './useMaterialCompletion';
import { Audio } from '@/components/Audio';
import { DesignResources } from '@/components/designResources';
import { Section } from '@/components/Section';
import { useStayLoggedIn } from '@/hooks/useStayLoggedIn';
import { useStudentServices } from '@/hooks/useStudentServices';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';
import { endpoint } from 'src/basePath';
import { formatDate } from 'src/formatDate';

type Props = {
  studentId: number;
  courseId: number;
};

export const CourseView: FC<Props> = ({ studentId, courseId }) => {
  const { enrollmentService } = useStudentServices();
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const [ playingVideoId, setPlayingVideoId ] = useState<string>();

  // we're going to be linking to static resources that require the user to be
  // logged in, and those resources don't have a refresh mechanism
  useStayLoggedIn();

  useInitialData(dispatch, studentId, courseId);
  const materialCompletion$ = useMaterialCompletion(dispatch);

  const initializeNextUnit$ = useInitializeNextUnit(dispatch);

  const nextUnit = useMemo(() => getNextUnit(state.data?.enrollment), [ state.data?.enrollment ]);

  const hasVideos = useMemo(() => state.data?.enrollment.course.units.some(u => u.videos.length > 0), [ state.data?.enrollment.course.units ]);
  // const hasResources = useMemo(() => enrollment.course.units.some(u => u.videos.length > 0), [ enrollment.course.units ]);
  const hasResources = false;

  const certificationData = useMemo(() => (state.data?.enrollment.course.code ? certificationDataDictionary[state.data?.enrollment.course.code] : undefined), [ state.data?.enrollment.course.code ]);

  const handleNewUnitClick = useCallback((e: MouseEvent<HTMLTableRowElement>, submissionId: string): void => {
    void router.push(`/students/courses/${courseId}/submissions/${submissionId}`);
  }, [ router, courseId ]);

  const isDesignCourse = state.data?.enrollment.course.school.slug === 'design';

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.data) {
    return (
      <>
        <Section>
          <CourseHeaderImage courseId={courseId} />
          <div className="container text-white" style={{ minHeight: 240 }} aria-hidden="true">
            <div className="row">
              <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                <h1 className="mb-0 placeholder-glow"><span className="placeholder col-8" /></h1>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
              </div>
              <div className="col-12 col-lg-6">
                <h2 className="h4 placeholder-glow"><span className="placeholder col-6" /></h2>
                <div className="placeholder-glow mb-4" style={{ height: 80 }}><span className="placeholder col-12 h-100" /></div>
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

  const enrollment = state.data.enrollment;
  const enrollmentId = enrollment.enrollmentId;
  const materialCompletions = enrollment.materialCompletions;

  const [ graduated, graduatedDate ] = state.data.crmEnrollment
    ? [ state.data.crmEnrollment.status === 'G', state.data.crmEnrollment.status === 'G' ? state.data.crmEnrollment.statusDate : null ]
    : [ enrollment.graduated, null ];

  if (enrollment.course.submissionType !== 1) {
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

  const handleVideoPlay = (e: SyntheticEvent<HTMLVideoElement, Event>, videoId: string): void => {
    setPlayingVideoId(videoId);
  };

  const expired = enrollment.dueDate !== null && enrollment.dueDate <= new Date();

  const handleProgressResetDismissed = (): void => {
    enrollmentService.insertOrUpdateMetadata(enrollment.studentId, enrollment.courseId, 'progressResetDismissed', '1').subscribe(() => {
      dispatch({ type: 'METADATA_INSERTED_OR_UPDATED', payload: { name: '', value: '1' } });
    });
  };

  return (
    <>
      <Section>
        <CourseHeaderImage courseId={courseId} />
        <div className="container text-white" style={{ minHeight: 240 }}>
          {courseId === 118 && (
            <div className="d-lg-none mb-4"><Image src={EWLogo} alt="Earthwise" width="40" height="59" /></div>
          )}
          <div className="row">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <h1 className="mb-0 mb-2 text-shadow">{enrollment.course.name}</h1>
              <p className="lead mb-0 text-shadow">Student Number: <strong>{enrollment.course.code}&thinsp;{enrollment.studentNumber}</strong></p>
              {enrollment.tutor && <p className="lead mb-0 text-shadow">Tutor: <strong>{enrollment.tutor.firstName} {enrollment.tutor.lastName}</strong></p>}
              {enrollment.dueDate && <p className="lead mb-0 text-shadow">Complete By: <strong>{formatDate(enrollment.dueDate)}</strong></p>}
              <HandbookButton course={enrollment.course} />
              <div className="mt-5">
                <p className="lead mb-0 text-shadow"><MdCollectionsBookmark /> <a href="#materials" style={{ textDecoration: 'none' }} className="text-white">Course Materials</a></p>
                {hasResources && <p className="lead mb-0 text-shadow"><MdListAlt /> <a href="#resources" style={{ textDecoration: 'none' }} className="text-white">Resources</a></p>}
                {hasVideos && <p className="lead mb-0 text-shadow"><MdMovie /> <a href="#videos" style={{ textDecoration: 'none' }} className="text-white">Videos</a></p>}
                {certificationData && <p className="lead mb-0 text-shadow"><MdPolicy /> <a href="#certification" style={{ textDecoration: 'none' }} className="text-white">Certification Logo</a></p>}
                {enrollment.tutor?.introduction && (
                  <>
                    <p className="lead mb-2 text-shadow"><MdMusicNote /> Tutor Introduction</p>
                    <Audio src={`${endpoint}/students/${studentId}/courses/${courseId}/tutorIntro`} preload="metadata" controls />
                  </>
                )}
              </div>
              <CourseProgress enrollment={enrollment} onProgressResetDismissed={handleProgressResetDismissed} />
            </div>
            <div className="col-12 col-lg-6">
              {enrollment.newSubmissions.length > 0 && (
                <>
                  <p id="assignments" className="lead mb-2 text-shadow menuScrollOffset"><MdAssignmentTurnedIn /> Assignments</p>
                  <SubmissionsTable newSubmissions={enrollment.newSubmissions} onNewUnitClick={handleNewUnitClick} />
                </>
              )}
              {courseId === 118 && <div className="d-none d-lg-flex justify-content-center"><Image src={EWLogo} alt="Earthwise" /></div>}
              {enrollment.onHold && (
                <div className="alert alert-danger mt-4">
                  This course is on hold. Please contact the School for more information.
                </div>
              )}
              {expired && (
                <div className="alert alert-danger mt-3">
                  <p>Your course due date has passed. Please contact the School to extend your course and pay your extension fee.</p>
                  <p className="mb-0">You will be unable to submit assignments or complete lessons until your course has been extended.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section id="materials">
        <div className="container">
          <h2>Course Materials</h2>
          {enrollment.course.units.length > 0 && (
            <>
              {enrollment.course.units.map((u, i) => (
                <UnitAccordion
                  key={u.unitId}
                  studentId={studentId}
                  enrollmentId={enrollmentId}
                  courseId={courseId}
                  unit={u}
                  materialCompletions={materialCompletions}
                  materialCompletion$={materialCompletion$}
                  firstUnit={i === 0}
                  expired={expired}
                  submission={enrollment.newSubmissions.find(s => s.unitLetter === u.unitLetter)}
                  nextUnit={nextUnit}
                  assignmentsDisabled={enrollment.assignmentsDisabled}
                  onInitializeButtonClick={handleInitializeButtonClick}
                  formState={state.form}
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
            {enrollment.course.units.map(u => {
              if (u.videos.length === 0) {
                return null;
              }
              return (
                <Fragment key={u.unitId}>
                  <h3 className="h5">Unit {u.unitLetter}</h3>
                  <div className="row mb-2">
                    {u.videos.map(v => (
                      <div key={v.videoId} className="col-12 col-md-6 col-lg-4 col-xxl-3 mb-4">
                        <CourseVideo videoId={v.videoId} src={v.src} posterSrc={v.posterSrc ?? undefined} captionSrc={v.captionSrc} playingVideoId={playingVideoId} onPlay={handleVideoPlay} />
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
      {isDesignCourse && <DesignResources />}
      {certificationData && (
        <CertificationLogoSection
          certificationData={certificationData}
          graduated={graduated}
          graduatedDate={graduatedDate}
          amountPaidRate={enrollment.amountPaid === 0 ? 1 : enrollment.courseCost / enrollment.amountPaid}
        />
      )}
    </>
  );
};

export type NextUnitResult = {
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
