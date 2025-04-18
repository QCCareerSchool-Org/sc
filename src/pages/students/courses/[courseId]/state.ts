import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { Material } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { Metadata } from '@/domain/metadata';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { School } from '@/domain/school';
import type { CRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { NewSubmission } from '@/domain/student/newSubmission';
import type { Student } from '@/domain/student/student';
import type { Tutor } from '@/domain/student/tutor';
import type { Unit } from '@/domain/unit';
import type { Variant } from '@/domain/variant';
import type { Video } from '@/domain/video';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

export type MaterialWithCompletionForm = Material & {
  complete: boolean;
  materialData: Record<string, string>;
  processingState: 'idle' | 'processing';
  errorMessage?: string;
};

export type EnrollmentState = Enrollment & {
  student: Student;
  course: Course & {
    school: School;
    variant: Variant | null;
    newSubmissionTemplates: NewSubmissionTemplate[];
    units: Array<Unit & {
      materials: MaterialWithCompletionForm[];
      videos: Video[];
    }>;
  };
  tutor: Tutor | null;
  newSubmissions: NewSubmission[];
  materialCompletions: MaterialCompletion[];
  metadata: Metadata[];
};

type Data = {
  enrollment: EnrollmentState;
  crmEnrollment?: CRMEnrollment;
};

type DataPayload = {
  enrollment: EnrollmentWithStudentCourseAndUnits;
  crmEnrollment?: CRMEnrollment;
};

export type State = {
  data?: Data;
  form: {
    processingState: 'idle' | 'initializing' | 'initialize error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: DataPayload }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'INITIALIZE_UNIT_STARTED' }
  | { type: 'INITIALIZE_UNIT_SUCCEEDED'; payload: NewSubmission }
  | { type: 'INITIALIZE_UNIT_FAILED'; payload?: string }
  | { type: 'MATERIAL_COMPLETION_STARTED'; payload: string }
  | { type: 'MATERIAL_COMPLETION_INSERTED'; payload: MaterialCompletion }
  | { type: 'MATERIAL_COMPLETION_DELETED'; payload: string }
  | { type: 'MATERIAL_COMPLETION_FAILED'; payload: { materialId: string; errorMessage?: string } }
  | { type: 'METADATA_INSERTED_OR_UPDATED'; payload: { name: string; value: string | null } };

export const initialState: State = {
  error: false,
  form: { processingState: 'idle' },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        data: {
          ...action.payload,
          enrollment: {
            ...action.payload.enrollment,
            course: {
              ...action.payload.enrollment.course,
              units: action.payload.enrollment.course.units.map(u => ({
                ...u,
                materials: u.materials.map(m => ({ ...m, processingState: 'idle' })),
              })),
            },
          },
        },
        error: false,
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'INITIALIZE_UNIT_STARTED':
      return { ...state, form: { ...state.form, processingState: 'initializing', errorMessage: undefined } };
    case 'INITIALIZE_UNIT_SUCCEEDED':
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      return {
        ...state,
        data: {
          ...state.data,
          enrollment: { ...state.data.enrollment, newSubmissions: [ ...state.data.enrollment.newSubmissions, action.payload ] },
        },
        form: { ...state.form, processingState: 'idle' },
      };
    case 'INITIALIZE_UNIT_FAILED':
      return { ...state, form: { ...state.form, processingState: 'initialize error', errorMessage: action.payload } };
    case 'MATERIAL_COMPLETION_STARTED': {
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      return {
        ...state,
        data: {
          ...state.data,
          enrollment: {
            ...state.data.enrollment,
            course: {
              ...state.data.enrollment.course,
              units: state.data.enrollment.course.units.map(u => {
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
        },
      };
    }
    case 'MATERIAL_COMPLETION_INSERTED': {
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      return {
        ...state,
        data: {
          ...state.data,
          enrollment: {
            ...state.data.enrollment,
            course: {
              ...state.data.enrollment.course,
              units: state.data.enrollment.course.units.map(u => {
                const material = u.materials.find(m => m.materialId === action.payload.materialId);
                if (material) { // this is the unit that contains the material in question
                  return {
                    ...u,
                    materials: u.materials.map(m => {
                      if (m === material) { // this is the material in question
                        return { ...m, complete: true, processingState: 'idle' };
                      }
                      return m; // return the original material
                    }),
                  };
                }
                return u; // return the original unit
              }),
            },
            materialCompletions: [ ...state.data.enrollment.materialCompletions, action.payload ],
          },
        },
      };
    }
    case 'MATERIAL_COMPLETION_DELETED': {
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      return {
        ...state,
        data: {
          ...state.data,
          enrollment: {
            ...state.data.enrollment,
            course: {
              ...state.data.enrollment.course,
              units: state.data.enrollment.course.units.map(u => {
                const material = u.materials.find(m => m.materialId === action.payload);
                if (material) { // this is the unit that contains the material in question
                  return {
                    ...u,
                    materials: u.materials.map(m => {
                      if (m === material) { // this is the material in question
                        return { ...m, complete: m.materialData['cmi.completion_status'] === 'complete', processingState: 'idle' };
                      }
                      return m; // return the original material
                    }),
                  };
                }
                return u; // return the original unit
              }),
            },
            materialCompletions: state.data.enrollment.materialCompletions.filter(m => m.materialId !== action.payload),
          },
        },
      };
    }
    case 'MATERIAL_COMPLETION_FAILED': {
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      return {
        ...state,
        data: {
          ...state.data,
          enrollment: {
            ...state.data.enrollment,
            course: {
              ...state.data.enrollment.course,
              units: state.data.enrollment.course.units.map(u => {
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
        },
      };
    }
    case 'METADATA_INSERTED_OR_UPDATED': {
      if (typeof state.data === 'undefined') {
        throw Error('data is undefined');
      }
      const newElement: Metadata = { name: action.payload.name, value: action.payload.value };
      let metadata: Metadata[];
      const index = state.data.enrollment.metadata.findIndex(m => m.name === action.payload.name);
      if (index === -1) {
        metadata = [ ...state.data.enrollment.metadata, newElement ];
      } else {
        metadata = [ ...state.data.enrollment.metadata.slice(0, index), newElement, ...state.data.enrollment.metadata.slice(index + 1) ];
      }
      return { ...state, data: { ...state.data, enrollment: { ...state.data.enrollment, metadata } } };
    }
  }
};
