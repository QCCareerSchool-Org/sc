import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewTextBox, RawNewTextBox } from '@/domain/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/newUploadSlot';
import type { IHttpService, ProgressResponse } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewAssignmentWithChildren = NewAssignment & {
  newAssignmentMedia: NewAssignmentMedium[];
  newParts: Array<NewPart & {
    newTextBoxes: Array<NewTextBox>;
    newUploadSlots: Array<NewUploadSlot>;
    newPartMedia: NewPartMedium[];
  }>;
};

type RawNewAssignmentWithChildren = RawNewAssignment & {
  newAssignmentMedia: RawNewAssignmentMedium[];
  newParts: Array<RawNewPart & {
    newTextBoxes: Array<RawNewTextBox>;
    newUploadSlots: Array<RawNewUploadSlot>;
    newPartMedia: RawNewPartMedium[];
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
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}/file`;
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
    const url = this.getUrl(studentId, courseId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}/file`;
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
      newAssignmentMedia: newAssignment.newAssignmentMedia.map(m => ({
        ...m,
        created: new Date(m.created),
        modified: m.modified === null ? null : new Date(m.modified),
      })),
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
        newPartMedia: p.newPartMedia.map(m => ({
          ...m,
          created: new Date(m.created),
          modified: m.modified === null ? null : new Date(m.modified),
        })),
      })),
    };
  };
}
