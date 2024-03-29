import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useCallback, useReducer } from 'react';
import { CourseCountryForm } from './CourseCountryForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
};

export const UnitPrice: FC<Props> = ({ administratorId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const router = useRouter();

  useInitialData(dispatch, administratorId);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const course = state.courses?.find(c => c.courseId === state.courseId);
    if (course?.submissionType === 0) {
      location.href = `/administatrators/unit-prices/index.php?course_id=${state.courseId}&country_code=${state.countryId ?? ''}`;
    } else if (course?.submissionType === 1) {
      if (state.countryId === null) {
        void router.push(`${router.asPath}/edit?courseId=${state.courseId}`);
      } else {
        void router.push(`${router.asPath}/edit?courseId=${state.courseId}&countryId=${state.countryId}`);
      }
    }
  };

  const handleCourseChange: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
    const courseId = parseInt(e.target.value, 10);
    if (!isNaN(courseId)) {
      dispatch({ type: 'COURSE_CHANGED', payload: courseId });
    }
  }, []);

  const handleCountryChange: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
    if (e.target.value === '') {
      dispatch({ type: 'COUNTRY_CHANGED', payload: null });
    } else {
      const countryId = parseInt(e.target.value, 10);
      if (!isNaN(countryId)) {
        dispatch({ type: 'COUNTRY_CHANGED', payload: countryId });
      }
    }
  }, []);

  if (state.processingState === 'load error') {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (state.processingState === 'initial' || state.processingState === 'loading') {
    return null;
  }

  if (typeof state.courses === 'undefined') {
    throw Error('courses is undefined');
  }
  if (typeof state.countries === 'undefined') {
    throw Error('countries is undefined');
  }
  if (typeof state.courseId === 'undefined') {
    throw Error('courseId is undefined');
  }
  if (typeof state.countryId === 'undefined') {
    throw Error('countryId is undefined');
  }

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6">
              <h1>Unit Prices</h1>
              <p>Please choose a course and country.</p>
              <CourseCountryForm
                courseId={state.courseId}
                countryId={state.countryId}
                courses={state.courses}
                countries={state.countries}
                onCourseChange={handleCourseChange}
                onCountryChange={handleCountryChange}
                onFormSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
