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
import { ContinuingEducationGroup } from '@/components/continuedEducation/ContinuingEducationGroup';
import { Section } from '@/components/Section';

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

  const crmStudent = state.data.crmStudent;

  const month = new Date().getMonth();
  const showTaxCreditMessage = state.data.student.country.code === 'CA' && month >= 9 && month <= 11; // between October 1 and December 31

  return (
    <>
      <Section>
        <div className="container">
          <h1>Online Student Center</h1>
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
        </div>
      </Section>
      {crmStudent && (
        <Section className="bg-f1">
          <div className="container">
            <h2 className="h4">Continued Education</h2>
            <p className="lead">Take your career to the next level by expanding your skillset. As a QC student, your are eligible to receive a <strong style={{ color: '#ca0000' }}>50% discount</strong> on all continued education courses.</p>
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
