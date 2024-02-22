import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewAssignment } from '@/domain/administrator/newAssignment';
import type { RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { NewSubmission } from '@/domain/auditor/newSubmission';
import type { RawStudent, Student } from '@/domain/auditor/student';
import type { Tutor } from '@/domain/auditor/tutor';
import type { Country } from '@/domain/country';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { Material, RawMaterial } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { Province } from '@/domain/province';
import type { School } from '@/domain/school';
import type { RawUnit, Unit } from '@/domain/unit';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

type RawAuditorStudentList = Array<RawStudent & {
  country: Country;
  province: Province | null;
  enrollments: Array<RawEnrollment & { course: Course }>;
  groups: string[];
}>;

export type AuditorStudentList = Array<Student & {
  country: Country;
  province: Province | null;
  enrollments: Array<Enrollment & { course: Course }>;
  groups: string[];
}>;

type RawAuditorStudent = RawStudent & {
  country: Country;
  province: Province | null;
  enrollments: Array<RawEnrollment & {
    course: Course & {
      school: School;
      oldSubmissionTemplates: unknown[];
      newSubmissionTemplates: RawNewSubmissionTemplate[];
      units: Array<RawUnit & {
        materials: Array<RawMaterial & { materialData: Record<string, string> }>;
      }>;
    };
    tutor: Tutor | null;
    oldSubmissions: unknown[];
    newSubmissions: RawNewSubmission[];
    materialCompletions: MaterialCompletion[];
  }>;
  groups: string[];
};

export type AuditorStudent = Student & {
  country: Country;
  province: Province | null;
  enrollments: Array<Enrollment & {
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
    newSubmissions: NewSubmission[];
    materialCompletions: MaterialCompletion[];
  }>;
  groups: string[];
};

type RawAuditorEnrollment = RawEnrollment & {
  course: Course & {
    school: School;
    oldSubmissionTemplates: unknown[];
    newSubmissionTemplates: RawNewSubmissionTemplate[];
    units: Array<Unit & {
      materials: Array<RawMaterial & { materialData: Record<string, string> }>;
    }>;
  };
  tutor: Tutor | null;
  oldSubmissions: unknown[];
  newSubmissions: Array<RawNewSubmission & {
    newAssignments: NewAssignment[];
    tutor: Tutor | null;
  }>;
  materialCompletions: MaterialCompletion[];
};

export type AuditorEnrollment = Enrollment & {
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
    newAssignments: NewAssignment[];
    tutor: Tutor | null;
  }>;
  materialCompletions: MaterialCompletion[];
};

type FilterConditions = {
  name?: string;
  group?: string;
  location?: string;
};

export interface IStudentService {
  getAllStudents: (auditorId: number, filter?: FilterConditions) => Observable<AuditorStudentList>;
  getStudent: (auditorId: number, studentId: number) => Observable<AuditorStudent>;
  getEnrollment: (auditorId: number, studentId: number, courseId: number) => Observable<AuditorEnrollment>;
}

export class StudentService implements IStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }
  public getAllStudents(auditorId: number, filter?: FilterConditions): Observable<AuditorStudentList> {
    let url = this.getBaseUrl(auditorId);
    if (filter) {
      const entries = Object.entries(filter);
      if (entries.length) {
        url += '?' + entries.map(([ key, value ]) => `filter[${key}]=${encodeURIComponent(value)}`).join('&');
      }
    }
    return this.httpService.get<RawAuditorStudentList>(url).pipe(
      map(this.mapStudents),
    );
  }

  public getStudent(auditorId: number, studentId: number): Observable<AuditorStudent> {
    const url = `${this.getBaseUrl(auditorId)}/${studentId}`;
    return this.httpService.get<RawAuditorStudent>(url).pipe(
      map(this.mapStudent),
    );
  }

  public getEnrollment(auditorId: number, studentId: number, courseId: number): Observable<AuditorEnrollment> {
    const url = `${this.getBaseUrl(auditorId)}/${studentId}/courses/${courseId}`;
    return this.httpService.get<RawAuditorEnrollment>(url).pipe(
      map(this.mapEnrollment),
    );
  }

  private getBaseUrl(auditorId: number): string {
    return `${endpoint}/auditors/${auditorId}/students`;
  }

  private readonly mapStudents = (raw: RawAuditorStudentList): AuditorStudentList => {
    return raw.map(r => ({
      ...r,
      lastLogin: r.lastLogin === null ? null : new Date(r.lastLogin),
      expiry: r.expiry === null ? null : new Date(r.expiry),
      created: new Date(r.created),
      modified: new Date(r.modified),
      enrollments: r.enrollments.map(e => ({
        ...e,
        enrollmentDate: e.enrollmentDate === null ? null : new Date(e.enrollmentDate),
        dueDate: e.dueDate === null ? null : new Date(e.dueDate),
      })),
    }));
  };

  private readonly mapStudent = (raw: RawAuditorStudent): AuditorStudent => {
    return {
      ...raw,
      lastLogin: raw.lastLogin === null ? null : new Date(raw.lastLogin),
      expiry: raw.expiry === null ? null : new Date(raw.expiry),
      created: new Date(raw.created),
      modified: new Date(raw.modified),
      enrollments: raw.enrollments.map(e => ({
        ...e,
        enrollmentDate: e.enrollmentDate === null ? null : new Date(e.enrollmentDate),
        dueDate: e.dueDate === null ? null : new Date(e.dueDate),
        course: {
          ...e.course,
          newSubmissionTemplates: e.course.newSubmissionTemplates.map(t => ({
            ...t,
            created: new Date(t.created),
            modified: t.modified === null ? null : new Date(t.modified),
          })),
          units: e.course.units.map(u => ({
            ...u,
            created: new Date(u.created),
            modified: u.modified === null ? null : new Date(u.modified),
            materials: u.materials.map(m => ({
              ...m,
              created: new Date(m.created),
              modified: m.modified === null ? null : new Date(m.modified),
            })),
          })),
        },
        newSubmissions: e.newSubmissions.map(n => ({
          ...n,
          submitted: n.submitted === null ? null : new Date(n.submitted),
          transferred: n.transferred === null ? null : new Date(n.transferred),
          closed: n.closed === null ? null : new Date(n.closed),
          created: new Date(n.created),
          modified: n.modified === null ? null : new Date(n.modified),
        })),
      })),
    };
  };

  private readonly mapEnrollment = (raw: RawAuditorEnrollment): AuditorEnrollment => {
    return {
      ...raw,
      enrollmentDate: raw.enrollmentDate === null ? null : new Date(raw.enrollmentDate),
      dueDate: raw.dueDate === null ? null : new Date(raw.dueDate),
      course: {
        ...raw.course,
        newSubmissionTemplates: raw.course.newSubmissionTemplates.map(t => ({
          ...t,
          created: new Date(t.created),
          modified: t.modified === null ? null : new Date(t.modified),
        })),
        units: raw.course.units.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
          materials: u.materials.map(m => ({
            ...m,
            created: new Date(m.created),
            modified: m.modified === null ? null : new Date(m.modified),
          })),
        })),
      },
      newSubmissions: raw.newSubmissions.map(n => ({
        ...n,
        submitted: n.submitted === null ? null : new Date(n.submitted),
        transferred: n.transferred === null ? null : new Date(n.transferred),
        closed: n.closed === null ? null : new Date(n.closed),
        created: new Date(n.created),
        modified: n.modified === null ? null : new Date(n.modified),
      })),
    };
  };
}
