import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import { ContinuingEducationGroup } from './ContinuingEducationGroup';
import { courseSuggestionGroups } from './courseSuggestions';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  studentId: number;
};

export const ContinuedEducation: FC<Props> = ({ studentId }) => {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId);

  const schoolSlugs = useMemo(() => {
    return state.data?.student.enrollments
      .map(e => e.course.school.slug)
      .filter((item, pos, self) => self.indexOf(item) === pos);
  }, [ state.data?.student.enrollments ]);

  const courses = useMemo(() => state.data?.student.enrollments.map(e => e.course), [ state.data?.student.enrollments ]);

  if (!state.data || !courses) {
    return null;
  }

  const crmStudent = state.data.crmStudent;

  return (
    <Section className="bg-f1">
      <div className="container">
        <h1>Continued Education</h1>
        <p className="lead">Take your career to the next level by expanding your skillset. As a QC student, your are eligible to receive a <strong style={{ color: '#ca0000' }}>50% discount</strong> on all continued education courses.</p>
        {crmStudent && schoolSlugs?.map(s => courseSuggestionGroups[s].map(group => {
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
      </div>
    </Section>
  );
};
