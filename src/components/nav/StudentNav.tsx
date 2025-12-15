import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { catchError, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import type { StudentType } from '@/domain/authenticationPayload';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';
import { useServices } from '@/hooks/useServices';

export type StudentNavProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StudentNav: FC<StudentNavProps> = props => {
  const router = useRouter();
  const { loginService } = useServices();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const navState = useNavState();
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const logOut$ = useRef(new Subject<void>());

  // const handleLogoutClick: MouseEventHandler = e => {
  //   e.preventDefault();
  //   logOut$.current.next();
  // };

  useEffect(() => {
    const destroy$ = new Subject<void>();
    logOut$.current.pipe(
      switchMap(() => loginService.logOut()),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe(() => {
      authDispatch({ type: 'STUDENT_LOG_OUT' });
    });
    return () => { destroy$.next(); destroy$.complete(); };
  }, [ authState, loginService, router, authDispatch ]);

  // Loading the bootstrap javascript library on the server causes errors due
  // to missing window, etc., so we only load it on the client in _app.tsx. The
  // library causes changes to the navigation bar, meaning the server and
  // client would render different outputs. To ensure the server and client
  // render the same thing, initially render null and only render the nav bar
  // after a re-render
  if (!loaded) {
    return null;
  }

  if (typeof authState.studentId === 'undefined') {
    return null;
  }

  const adminLoggedIn = typeof authState.administratorId !== 'undefined';
  const tutorLoggedIn = typeof authState.tutorId !== 'undefined';
  const auditorLoggedIn = typeof authState.auditorId !== 'undefined';
  const otherNavPresent = adminLoggedIn || tutorLoggedIn || auditorLoggedIn;

  const index = navState.type === 'student' ? navState.index : undefined;

  return (
    <>
      <nav className={`mainNav navbar sticky-top navbar-expand-md navbar-light bg-white ${otherNavPresent ? '' : 'shadow'}`}>
        <div className="container">
          <a className="d-md-none navbar-brand" href="#">Student Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#studentNav" aria-controls="studentNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="studentNav">
            {otherNavPresent && <span className="d-none d-md-inline me-3" style={{ minWidth: 64 }}><span className="badge text-bg-secondary">Student</span></span>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {authState.studentType === 'general'
                ? <GeneralNavItems studentId={authState.studentId} index={index} />
                : <OldNavItems studentId={authState.studentId} studentType={authState.studentType} index={index} />
              }
            </ul>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .mainNav {
          ${otherNavPresent && 'border-bottom: 1px solid #ccc;'}
          z-index: 1022;
        }
      `}</style>
    </>
  );
};

type GeneralNavItemsProps = {
  studentId: number;
  index?: number;
};

const GeneralNavItems: FC<GeneralNavItemsProps> = ({ index }) => (
  <>
    <li className="nav-item">
      <Link href="/students/courses" className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Home{index === 0 && <div className="active-indicator" />}</Link>
    </li>
    <li className="nav-item">
      <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/students/student-resources/vendors.bs.php"><span className="d-none d-xl-inline">Preferred </span>Partners{index === 1 && <div className="active-indicator" />}</a>
    </li>
    <li className="nav-item">
      <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/students/badges.bs.php">{index === 2 && <div className="active-indicator" />}<span className="d-none d-xl-inline">School </span>Badges</a>
    </li>
    <li className="nav-item">
      <a className={`nav-link ${index === 4 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/students/virtual-community.php">Community Resources</a>
    </li>
    <li className="nav-item">
      <Link href="/students/account" className={`nav-link ${index === 5 ? 'active' : ''}`} aria-current={index === 5 ? 'page' : undefined}><span className="d-none d-xl-inline">My </span>Account</Link>
    </li>
  </>
);

type OldNavItemsProps = {
  studentId: number;
  index?: number;
  studentType?: StudentType;
  assignmentsEnabled?: boolean;
};

const OldNavItems: FC<OldNavItemsProps> = ({ index, studentType, assignmentsEnabled = true }) => {
  return (
    <>
      <li className="nav-item">
        <a href="/students/index.php" className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Home{index === 0 && <div className="active-indicator" />}</a>
      </li>
      {(studentType === 'event' || studentType === 'design') && (
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarAssignmentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            My Assignments{index === 1 && <div className="active-indicator" />}
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarAssignmentsDropdown">
            <li><a className="dropdown-item" href="/students/materials/templates.php">Assignment {studentType === 'event' ? 'Worksheets' : 'Templates'}</a></li>
            {assignmentsEnabled
              ? <li><a className="dropdown-item" href="/students/units">Submit/Review Assignments</a></li>
              : <li><a className="dropdown-item" href="/students/tutor-files">Tutor Uploads</a></li>
            }
          </ul>
        </li>
      )}
      {studentType === 'writing' && (
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarAssignmentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            My Exercises{index === 1 && <div className="active-indicator" />}
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarAssignmentsDropdown">
            {/* <li><a className="dropdown-item" href="/students/writing-profiles/submit.php">Submit Personal Profile</a></li> */}
            {assignmentsEnabled
              ? (
                <>
                  <li><a className="dropdown-item" href="/students/writing-assignments/submit.php">Submit Exercises</a></li>
                  <li><a className="dropdown-item" href="/students/writing-assignments/review.php">Review Exercises</a></li>
                </>
              )
              : <li><a className="dropdown-item" href="/students/tutor-files">Tutor Uploads</a></li>
            }
          </ul>
        </li>
      )}
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarResourcesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Course Resources{index === 2 && <div className="active-indicator" />}
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarResourcesDropdown">
          {(studentType === 'event' || studentType === 'design') && (
            <li><a className="dropdown-item" href="/students/how-to-videos.php">How-To Videos</a></li>
          )}
          <li><a className="dropdown-item" href="/students/materials">Course Materials and Updates</a></li>
          {studentType === 'event' && (
            <li><a className="dropdown-item" href="/students/materials/index.php?q=videos">Videos</a></li>
          )}
          {(studentType === 'event' || studentType === 'design') && (
            <>
              <li><a className="dropdown-item" href="/students/materials/career-center.php">Career Center</a></li>
              <li><a className="dropdown-item" href="/students/business-resources">Business Resources</a></li>
              <li><a className="dropdown-item" href="/students/student-resources/vendors.php">Preferred Partners</a></li>
              <li><a className="dropdown-item" href="/students/certification-logos">Certification Logos</a></li>
              <li><a className="dropdown-item" href="/students/showcases/new.php">Student Showcase</a></li>
            </>
          )}
          <li><a className="dropdown-item" href="/students/badges.php">School Badges</a></li>
          {(studentType === 'event' || studentType === 'design') && (
            <li><a className="dropdown-item d-none d-md-block d-lg-none" href="/students/virtual-community.php">Community Resources</a></li>
          )}
        </ul>
      </li>
      {(studentType === 'event' || studentType === 'design') && (
        <li className="nav-item d-md-none d-lg-inline">
          <a href="/students/virtual-community.php" className="nav-link">Community Resources</a>
        </li>
      )}
      <li className="nav-item">
        <a href="/students/logout.php" className="nav-link">Log Out</a>
      </li>
    </>
  );
};
