import type { Country } from '@/domain/country';
import type { CourseWithSchool } from '@/services/administrators/courseService';

export type State = {
  courses?: CourseWithSchool[];
  countries?: Country[];
  courseId?: number;
  countryId?: number | null;
  processingState: 'initial' | 'idle' | 'loading' | 'load error';
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_STARTED' }
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { courses: CourseWithSchool[]; countries: Country[] } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'COURSE_CHANGED'; payload: number }
  | { type: 'COUNTRY_CHANGED'; payload: number | null };

export const initialState: State = {
  processingState: 'initial',
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_STARTED':
      return { ...state, processingState: 'loading', errorCode: undefined };
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        courses: action.payload.courses,
        countries: action.payload.countries,
        courseId: action.payload.courses[0]?.courseId,
        countryId: null,
        processingState: 'idle',
      };
    case 'LOAD_DATA_FAILED':
      return {
        courses: undefined,
        countries: undefined,
        courseId: undefined,
        countryId: undefined,
        processingState: 'load error',
        errorCode: action.payload,
      };
    case 'COURSE_CHANGED':
      return { ...state, courseId: action.payload };
    case 'COUNTRY_CHANGED':
      return { ...state, countryId: action.payload };
  }
};
