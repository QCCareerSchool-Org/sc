import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, NewPart, NewTextBox, NewUploadSlot } from '../../domain/students';
import { IHttpService } from '../httpService';

export type NewAssignmentWithChildren = NewAssignment & {
  parts: Array<NewPart & {
    textBoxes: Array<NewTextBox>;
    uploadSlots: Array<NewUploadSlot>;
  }>;
};

export interface INewAssignmentService {
  getAssignment: (studentId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentWithChildren>;
  saveText: (studentId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, text: string) => Observable<NewTextBox>;
  uploadFile: (studentId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File) => Observable<number>;
  deleteFile: (studentId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(studentId: number, unitId: string, assignmentId: string): Observable<NewAssignmentWithChildren> {
    const url = this.getUrl(studentId, unitId, assignmentId);
    return this.httpService.get<NewAssignmentWithChildren>(url);
  }

  public saveText(studentId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, text: string): Observable<NewTextBox> {
    const url = this.getUrl(studentId, unitId, assignmentId) + `/parts/${partId}/textBoxes/${textBoxId}`;
    const body = { text };
    return this.httpService.put<NewTextBox>(url, body);
  }

  public uploadFile(studentId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File): Observable<number> {
    const url = this.getUrl(studentId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    return this.httpService.putFile(url, formData, { headers });
  }

  public deleteFile(studentId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = this.getUrl(studentId, unitId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}`;
    return this.httpService.delete(url);
  }

  private getUrl(studentId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/students/${studentId}/newUnits/${unitId}/assignments/${assignmentId}`;
  }
}
