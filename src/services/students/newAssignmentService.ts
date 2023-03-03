import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewTextBox, RawNewTextBox } from '@/domain/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/newUploadSlot';
import type { NewSubmission, RawNewSubmission } from '@/domain/student/newSubmission';
import type { IHttpService, ProgressResponse } from '@/services/httpService';

export type NewAssignmentWithChildren = NewAssignment & {
  newSubmission: Omit<NewSubmission, 'complete' | 'points' | 'mark'>;
  newAssignmentMedia: NewAssignmentMedium[];
  newParts: Array<NewPart & {
    newTextBoxes: Array<NewTextBox>;
    newUploadSlots: Array<NewUploadSlot>;
    newPartMedia: NewPartMedium[];
  }>;
};

type RawNewAssignmentWithChildren = RawNewAssignment & {
  newSubmission: Omit<RawNewSubmission, 'complete' | 'points' | 'mark'>;
  newAssignmentMedia: RawNewAssignmentMedium[];
  newParts: Array<RawNewPart & {
    newTextBoxes: Array<RawNewTextBox>;
    newUploadSlots: Array<RawNewUploadSlot>;
    newPartMedia: RawNewPartMedium[];
  }>;
};

export interface INewAssignmentService {
  getAssignment: (studentId: number, courseId: number, submissionId: string, assignmentId: string) => Observable<NewAssignmentWithChildren>;
  saveText: (studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, textBoxId: string, text: string) => Observable<NewTextBox>;
  uploadFile: (studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File) => Observable<ProgressResponse<NewUploadSlot>>;
  deleteFile: (studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
  downloadFile: (studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
  downloadAssignmentMedia: (studentId: number, courseId: number, submissionId: string, assignmentId: string, assignmentMediaId: string) => Observable<void>;
  downloadPartMedia: (studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, partMediaId: string) => Observable<void>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(studentId: number, courseId: number, submissionId: string, assignmentId: string): Observable<NewAssignmentWithChildren> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId);
    return this.httpService.get<RawNewAssignmentWithChildren>(url).pipe(
      map(this.mapNewAssignmentWithChildren),
    );
  }

  public saveText(studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, textBoxId: string, text: string): Observable<NewTextBox> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/parts/${partId}/textBoxes/${textBoxId}`;
    const body = { text };
    return this.httpService.put<RawNewTextBox>(url, body).pipe(
      map(t => ({
        ...t,
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
    );
  }

  public uploadFile(studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string, file: File): Observable<ProgressResponse<NewUploadSlot>> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}/file`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    return this.httpService.putFile<RawNewUploadSlot>(url, formData, { headers }).pipe(
      map(progressResponse => {
        if (progressResponse.type === 'progress') {
          return progressResponse;
        }
        return { type: 'data', value: this.mapNewUploadSlot(progressResponse.value) };
      }),
    );
  }

  public deleteFile(studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}/file`;
    return this.httpService.delete(url);
  }

  public downloadFile(studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/parts/${partId}/uploadSlots/${uploadSlotId}/file`;
    return this.httpService.download(url);
  }

  public downloadAssignmentMedia(studentId: number, courseId: number, submissionId: string, assignmentId: string, assignmentMediaId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/media/${assignmentMediaId}/file`;
    return this.httpService.download(url);
  }

  public downloadPartMedia(studentId: number, courseId: number, submissionId: string, assignmentId: string, partId: string, partMediaId: string): Observable<void> {
    const url = this.getUrl(studentId, courseId, submissionId, assignmentId) + `/parts/${partId}/media/${partMediaId}/file`;
    return this.httpService.download(url);
  }

  private getUrl(studentId: number, courseId: number, submissionId: string, assignmentId: string): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${submissionId}/assignments/${assignmentId}`;
  }

  private readonly mapNewAssignmentWithChildren = (newAssignment: RawNewAssignmentWithChildren): NewAssignmentWithChildren => {
    return {
      ...newAssignment,
      created: new Date(newAssignment.created),
      modified: newAssignment.modified === null ? null : new Date(newAssignment.modified),
      newSubmission: {
        ...newAssignment.newSubmission,
        submitted: newAssignment.newSubmission.submitted === null ? null : new Date(newAssignment.newSubmission.submitted),
        transferred: newAssignment.newSubmission.transferred === null ? null : new Date(newAssignment.newSubmission.transferred),
        closed: newAssignment.newSubmission.closed === null ? null : new Date(newAssignment.newSubmission.closed),
        created: new Date(newAssignment.newSubmission.created),
        modified: newAssignment.newSubmission.modified === null ? null : new Date(newAssignment.newSubmission.modified),
      },
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

  private readonly mapNewUploadSlot = (newUploadSlot: RawNewUploadSlot): NewUploadSlot => {
    return {
      ...newUploadSlot,
      created: new Date(newUploadSlot.created),
      modified: newUploadSlot.modified === null ? null : new Date(newUploadSlot.modified),
    };
  };
}
