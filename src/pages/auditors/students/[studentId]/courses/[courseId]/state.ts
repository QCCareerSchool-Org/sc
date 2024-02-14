import type { NewSubmission } from '@/domain/auditor/newSubmission';
import type { Tutor } from '@/domain/auditor/tutor';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { Material } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { School } from '@/domain/school';
import type { Unit } from '@/domain/unit';

export type EnrollmentData = Enrollment & {
  course: Course & {
    school: School;
    oldSubmissionTemplates: unknown[];
    newSubmissionTemplates: NewSubmissionTemplate[];
    units: Array<Unit & {
      materials: Array<Material & { materialData: Record<string, string> }>;
    }>;
  };
  tutor: Tutor | null;
  oldSubmissions: unknown[];
  newSubmissions: Array<NewSubmission & {
    tutor: Tutor | null;
  }>;
  materialCompletions: MaterialCompletion[];
};

export type State = {
  enrollment?: EnrollmentData;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: EnrollmentData }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, enrollment: action.payload };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};

export const initialState: State = {
  error: false,
};
