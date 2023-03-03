import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { Material } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { School } from '@/domain/school';
import type { NewSubmission } from '@/domain/student/newSubmission';
import type { StudentStudent } from '@/domain/student/student';
import type { StudentTutor } from '@/domain/student/tutor';
import type { Unit } from '@/domain/unit';
import type { Video } from '@/domain/video';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

export type MaterialWithCompletionForm = Material & {
  processingState: 'idle' | 'processing';
  errorMessage?: string;
};

type EnrollmentState = Enrollment & {
  student: StudentStudent;
  course: Course & {
    school: School;
    newSubmissionTemplates: NewSubmissionTemplate[];
    units: Array<Unit & {
      materials: MaterialWithCompletionForm[];
      videos: Video[];
    }>;
  };
  tutor: StudentTutor | null;
  newSubmissions: NewSubmission[];
  materialCompletions: MaterialCompletion[];
};

export type State = {
  enrollment?: EnrollmentState;
  form: {
    processingState: 'idle' | 'initializing' | 'initialize error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_ENROLLMENT_SUCCEEDED'; payload: EnrollmentWithStudentCourseAndUnits }
  | { type: 'LOAD_ENROLLMENT_FAILED'; payload?: number }
  | { type: 'INITIALIZE_UNIT_STARTED' }
  | { type: 'INITIALIZE_UNIT_SUCCEEDED'; payload: NewSubmission }
  | { type: 'INITIALIZE_UNIT_FAILED'; payload?: string }
  | { type: 'MATERIAL_COMPLETION_STARTED'; payload: string }
  | { type: 'MATERIAL_COMPLETION_INSERTED'; payload: MaterialCompletion }
  | { type: 'MATERIAL_COMPLETION_DELETED'; payload: string }
  | { type: 'MATERIAL_COMPLETION_FAILED'; payload: { materialId: string; errorMessage?: string } };

export const initialState: State = {
  error: false,
  form: { processingState: 'idle' },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ENROLLMENT_SUCCEEDED':
      return {
        ...state,
        enrollment: {
          ...action.payload,
          course: {
            ...action.payload.course,
            units: action.payload.course.units.map(u => ({
              ...u,
              materials: u.materials.map(m => ({ ...m, processingState: 'idle' })),
            })),
          },
        },
        error: false,
      };
    case 'LOAD_ENROLLMENT_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'INITIALIZE_UNIT_STARTED':
      return { ...state, form: { ...state.form, processingState: 'initializing', errorMessage: undefined } };
    case 'INITIALIZE_UNIT_SUCCEEDED':
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: { ...state.enrollment, newSubmissions: [ ...state.enrollment.newSubmissions, action.payload ] },
        form: { ...state.form, processingState: 'idle' },
      };
    case 'INITIALIZE_UNIT_FAILED':
      return { ...state, form: { ...state.form, processingState: 'initialize error', errorMessage: action.payload } };
    case 'MATERIAL_COMPLETION_STARTED': {
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: {
          ...state.enrollment,
          course: {
            ...state.enrollment.course,
            units: state.enrollment.course.units.map(u => {
              const material = u.materials.find(m => m.materialId === action.payload);
              if (material) { // this is the unit that contains the material in question
                return {
                  ...u,
                  materials: u.materials.map(m => {
                    if (m === material) { // this is the material in question
                      return { ...m, processingState: 'processing' };
                    }
                    return m; // return the original material
                  }),
                };
              }
              return u; // return the original unit
            }),
          },
        },
      };
    }
    case 'MATERIAL_COMPLETION_INSERTED': {
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: {
          ...state.enrollment,
          course: {
            ...state.enrollment.course,
            units: state.enrollment.course.units.map(u => {
              const material = u.materials.find(m => m.materialId === action.payload.materialId);
              if (material) { // this is the unit that contains the material in question
                return {
                  ...u,
                  materials: u.materials.map(m => {
                    if (m === material) { // this is the material in question
                      return { ...m, processingState: 'idle' };
                    }
                    return m; // return the original material
                  }),
                };
              }
              return u; // return the original unit
            }),
          },
          materialCompletions: [ ...state.enrollment.materialCompletions, action.payload ],
        },
      };
    }
    case 'MATERIAL_COMPLETION_DELETED': {
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: {
          ...state.enrollment,
          course: {
            ...state.enrollment.course,
            units: state.enrollment.course.units.map(u => {
              const material = u.materials.find(m => m.materialId === action.payload);
              if (material) { // this is the unit that contains the material in question
                return {
                  ...u,
                  materials: u.materials.map(m => {
                    if (m === material) { // this is the material in question
                      return { ...m, processingState: 'idle' };
                    }
                    return m; // return the original material
                  }),
                };
              }
              return u; // return the original unit
            }),
          },
          materialCompletions: state.enrollment.materialCompletions.filter(m => m.materialId !== action.payload),
        },
      };
    }
    case 'MATERIAL_COMPLETION_FAILED': {
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: {
          ...state.enrollment,
          course: {
            ...state.enrollment.course,
            units: state.enrollment.course.units.map(u => {
              const material = u.materials.find(m => m.materialId === action.payload.materialId);
              if (material) { // this is the unit that contains the material in question
                return {
                  ...u,
                  materials: u.materials.map(m => {
                    if (m === material) { // this is the material in question
                      return { ...m, processingState: 'idle', errorMessage: action.payload.errorMessage };
                    }
                    return m; // return the original material
                  }),
                };
              }
              return u; // return the original unit
            }),
          },
        },
      };
    }
  }
};
