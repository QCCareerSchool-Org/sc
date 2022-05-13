import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { useMemo, useRef } from 'react';

import type { Country } from '@/domain/country';
import type { CourseWithSchool } from '@/services/administrators/courseService';

type Props = {
  courseId: number;
  countryId: number | null;
  courses: CourseWithSchool[];
  countries: Country[];
  onCourseChange: ChangeEventHandler<HTMLSelectElement>;
  onCountryChange: ChangeEventHandler<HTMLSelectElement>;
  onFormSubmit: FormEventHandler<HTMLFormElement>;
};

const defaultCountry = (countryName: string): boolean => {
  return [ 'Canada', 'United States', 'Australia', 'United Kingdom' ].includes(countryName);
};

type SchoolOptionGroup = { name: string; courses: Array<{ courseId: number; name: string }> };

const getCourseOptionGroups = (courses: CourseWithSchool[]): SchoolOptionGroup[] => {
  let i = 0;
  let schoolId: number;
  return courses.reduce<SchoolOptionGroup[]>((prev, cur) => {
    if (typeof schoolId === 'undefined') {
      prev.push({ name: cur.school.name, courses: [] });
      schoolId = cur.school.schoolId;
    } else if (cur.school.schoolId !== schoolId) {
      prev.push({ name: cur.school.name, courses: [] });
      schoolId = cur.school.schoolId;
      i++;
    }
    prev[i].courses.push({ courseId: cur.courseId, name: cur.name });
    return prev;
  }, []);
};

export const CourseCountryForm = (props: Props): ReactElement => {
  const id = useRef(Math.random().toString(32).slice(2)).current;

  const courseOptionGroups = useMemo(() => getCourseOptionGroups(props.courses), [ props.courses ]);

  return (
    <form onSubmit={props.onFormSubmit}>
      <div className="mb-3">
        <label htmlFor={id + '_course'} className="form-label">Course</label>
        <select id={id + '_course'} onChange={props.onCourseChange} value={props.courseId} className="form-select">
          {courseOptionGroups.map(g => (
            <optgroup key={g.name} label={g.name}>
              {g.courses.map(c => (
                <option key={c.courseId} value={c.courseId}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor={id + '_country'} className="form-label">Country</label>
        <select id={id + '_country'} onChange={props.onCountryChange} value={props.countryId ?? undefined} className="form-select">
          <option value="">Default</option>
          <optgroup label="Standard Countries">
            {props.countries.filter(c => defaultCountry(c.name)).map(c => (
              <option key={c.countryId} value={c.countryId}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Other Countries">
            {props.countries.filter(c => !defaultCountry(c.name)).map(c => (
              <option key={c.countryId} value={c.countryId}>{c.name}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <button className="btn btn-primary">Look Up Prices</button>
    </form>
  );
};
