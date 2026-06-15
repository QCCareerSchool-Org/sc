import type { Observable } from 'rxjs';

import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface IStudentService {
  saveTutorNote: (tutorId: number, studentId: number, note: string | null) => Observable<void>;
}

export class StudentService implements IStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public saveTutorNote(tutorId: number, studentId: number, note: string | null): Observable<void> {
    const url = `${this.getUrl(tutorId, studentId)}/tutorNote`;
    const body = { note };
    return this.httpService.put(url, body);
  }

  private getUrl(tutorId: number, studentId: number): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}`;
  }
}
