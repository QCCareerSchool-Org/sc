import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService, ProgressResponse } from '../httpService';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewTextBox, RawNewTextBox } from '@/domain/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/newUploadSlot';

export type NewAssignmentWithChildren = NewAssignment & {
  newParts: Array<NewPart & {
    newTextBoxes: Array<NewTextBox>;
    newUploadSlots: Array<NewUploadSlot>;
  }>;
};

type RawNewAssignmentWithChildren = RawNewAssignment & {
  newParts: Array<RawNewPart & {
    newTextBoxes: Array<RawNewTextBox>;
    newUploadSlots: Array<RawNewUploadSlot>;
  }>;
};

export interface INewAssignmentService {
  getAssignment: (studentId: number, courseId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentWithChildren>;
  saveText: (studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, text: string) => Observable<NewTextBox>;
  uploadFile: (studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File) => Observable<ProgressResponse<NewUploadSlot>>;
  deleteFile: (studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
  downloadFile: (studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(studentId: number, courseId: number, unitId: string, assignmentId: string): Observable<NewAssignmentWithChildren> {
    const url = this.getUrl(studentId, courseId, unitId, assignmentId);
    return this.httpService.get<RawNewAssignmentWithChildren>(url).pipe(
      map(this.mapNewAssignmentWithChildren),
    );
  }

  public saveText(studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, text: string): Observable<NewTextBox> {
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/textBoxes/${textBoxId}`;
    const body = { text };
    return this.httpService.put<RawNewTextBox>(url, body).pipe(
      map(t => ({
        ...t,
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
    );
  }

  public uploadFile(studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File): Observable<ProgressResponse<NewUploadSlot>> {
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    return this.httpService.putFile<NewUploadSlot>(url, formData, { headers });
  }

  public deleteFile(studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}`;
    return this.httpService.delete(url);
  }

  public downloadFile(studentId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}`;
    return this.httpService.download(url);
  }

  private getUrl(studentId: number, courseId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignments/${assignmentId}`;
  }

  private readonly mapNewAssignmentWithChildren = (newAssignment: RawNewAssignmentWithChildren): NewAssignmentWithChildren => {
    return {
      ...newAssignment,
      created: new Date(newAssignment.created),
      modified: newAssignment.modified === null ? null : new Date(newAssignment.modified),
      newParts: newAssignment.newParts.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
        newTextBoxes: p.newTextBoxes.map(t => ({
          ...t,
          created: new Date(t.created),
          modified: t.modified === null ? null : new Date(t.modified),
        })),
        newUploadSlots: p.newUploadSlots.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
        })),
      })),
    };
  };
}
