import Link from 'next/link';
import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import { CourseGrid } from './CourseGrid';
import { courseSuggestionGroups } from './courseSuggestions';
import { CourseWarnings } from './CourseWarnings';
import { initialState, reducer } from './state';
import { TaxCreditMessage } from './TaxCreditMessage';
import { UnchangedPasswordWarning } from './UnchangedPasswordWarning';
import { useInitialData } from './useInitialData';
import { WelcomeSurveys } from './WelcomeSurveys';
import { ContinuingEducationGroup } from '@/components/continuedEducation/ContinuingEducationGroup';
import { Section } from '@/components/Section';
import { getVirtualClassroomLink } from 'src/lib/virtualClassroomLink';

type Props = {
  administratorId?: number;
  studentId: number;
};

export const CourseIndex: FC<Props> = ({ studentId }) => {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId);

  // get an array of the unique school slugs
  const schoolSlugs = useMemo(() => {
    return state.data?.student.enrollments
      .map(e => e.course.school.slug)
      .filter((item, pos, self) => self.indexOf(item) === pos);
  }, [ state.data?.student.enrollments ]);

  // get an array of all the courses the student is enrolled in
  const courses = useMemo(() => {
    return state.data?.student.enrollments.map(e => e.course);
  }, [ state.data?.student.enrollments ]);

  if (!state.data || !courses) {
    return null;
  }

  const showVirtualClassroomAlert = schoolSlugs?.some(c => c === 'makeup' || c === 'event' || c === 'design' || c === 'pet');

  const crmStudent = state.data.crmStudent;

  const month = new Date().getMonth();
  const showTaxCreditMessage = state.data.student.country.code === 'CA' && month >= 9 && month <= 11; // between October 1 and December 31

  const now = new Date();
  const halloweenMessageEndDate = new Date(Date.UTC(2023, 9, 16, 15)); // October 16, 11:00 (15:00 UTC)
  const showHalloweenMessage = now < halloweenMessageEndDate && schoolSlugs?.includes('makeup');

  const blackFridayMessage = now >= new Date(Date.UTC(2023, 10, 16, 14, 30)) && now < new Date(Date.UTC(2023, 10, 27, 5))
    ? <><strong>Special Black Friday Offer:</strong> Take your career to the next level by expanding your skillset. Until November 26th, get <strong style={{ color: '#ca0000' }}>60% off</strong> all continued education makeup, event, and design courses.</>
    : now >= new Date(Date.UTC(2023, 10, 27, 5)) && now < new Date(Date.UTC(2023, 11, 1, 5))
      ? <><strong>Special Cyber Monday Offer:</strong> Take your career to the next level by expanding your skillset. Until November 30th, get <strong style={{ color: '#ca0000' }}>60% off</strong> all continued education makeup, event, and design courses.</>
      : undefined;

  return (
    <>
      <Section>
        <div className="container">
          <h1>Online Student Center</h1>
          <WelcomeSurveys student={state.data.student} />
          {showHalloweenMessage && (
            <div className="alert alert-info">
              Our Annual <a className="alert-link" href="https://forms.gle/sCu2QbQhbZj1wL6P8" target="_blank" rel="noreferrer">Halloween Contest</a> is back! Join the festivities with your peers in the <a className="alert-link" href="https://www.facebook.com/groups/qcmakeupacademyvc" target="_blank" rel="noreferrer">Virtual Classroom</a>!
            </div>
          )}
          {state.data.student.created >= new Date(Date.UTC(2023, 8, 22, 4)) && !state.data.student.passwordChanged && <UnchangedPasswordWarning />}
          {state.data.student.enrollments.length === 0
            ? <p className="lead">No enrollments found.</p>
            : (
              <>
                <CourseWarnings courses={courses} />
                <CourseGrid enrollments={state.data.student.enrollments} />
              </>
            )
          }
          {showVirtualClassroomAlert && (
            <div className="alert alert-primary">
              <h2 className="h5">Bonus: Join our Virtual Classroom!</h2>
              <p>Our QC community is leveling up! In addition to completing your course here on the Online Student Center, you can join our Virtual Classroom on Facebook! Engage with mentors, get exclusive content from industry experts, and network with peers in this dynamic space. Excited? We are too! See you there&mdash;request to join now!</p>
              {schoolSlugs?.includes('design') && <p className="mt-2 mb-0"><a target="_blank" rel="noreferrer" href={getVirtualClassroomLink('design')} className="alert-link">QC Design School Virtual Classroom</a></p>}
              {schoolSlugs?.includes('event') && <p className="mt-2 mb-0"><a target="_blank" rel="noreferrer" href={getVirtualClassroomLink('event')} className="alert-link">QC Event School Virtual Classroom</a></p>}
              {schoolSlugs?.includes('makeup') && <p className="mt-2 mb-0"><a target="_blank" rel="noreferrer" href={getVirtualClassroomLink('makeup')} className="alert-link">QC Makeup Academy Virtual Classroom</a></p>}
              {schoolSlugs?.includes('pet') && <p className="mt-2 mb-0"><a target="_blank" rel="noreferrer" href={getVirtualClassroomLink('pet')} className="alert-link">QC Pet Studies Virtual Classroom</a></p>}
            </div>
          )}
        </div>
      </Section>

      {crmStudent && (
        <Section className="bg-f1">
          <div className="container">
            <h2 className="h4">Continued Education</h2>
            <p className="lead">
              {blackFridayMessage
                ? blackFridayMessage
                : <>Take your career to the next level by expanding your skillset. As a QC student, your are eligible to receive a <strong style={{ color: '#ca0000' }}>50% discount</strong> on all continued education courses.</>
              }
            </p>
            {showTaxCreditMessage && <TaxCreditMessage />}
            {schoolSlugs?.map(s => courseSuggestionGroups[s].map(group => {
              return <ContinuingEducationGroup
                key={group.id}
                shippingDetails={{
                  sex: crmStudent.sex,
                  firstName: crmStudent.firstName,
                  lastName: crmStudent.lastName,
                  address1: crmStudent.address1,
                  address2: crmStudent.address2,
                  city: crmStudent.city,
                  provinceCode: crmStudent.province?.code,
                  postalCode: crmStudent.postalCode ?? undefined,
                  countryCode: crmStudent.country.code,
                  telephoneNumber: crmStudent.telephoneCountryCode === 1 ? crmStudent.telephoneNumber : `+${crmStudent.telephoneCountryCode} ${crmStudent.telephoneNumber}`,
                  emailAddress: crmStudent.emailAddress,
                }}
                schoolSlug={s}
                group={group}
                disabledCourses={courses}
              />;
            }))}
            <Link href="/students/courses/continued-education" passHref><button className="btn btn-outline-dark" style={{ borderRadius: 0, textTransform: 'uppercase' }}>View More Courses</button></Link>
          </div>
        </Section>
      )}
    </>
  );
};
