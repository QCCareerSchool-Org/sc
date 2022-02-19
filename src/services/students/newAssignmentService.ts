import { endpoint } from '../../basePath';
import type { NewAssignment, NewPart, NewTextBox, NewUploadSlot } from '../../domain/students';
import { HttpResponse, IHttpService } from '../httpService';

type Data = NewAssignment & {
  parts: Array<NewPart & {
    textBoxes: Array<NewTextBox>;
    uploadSlots: Array<NewUploadSlot>;
  }>;
};

export interface INewAssignmentService {
  getAssignment: (studentId: number, unitId: string, assignmentId: string) => Promise<HttpResponse<Data>>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public async getAssignment(studentId: number, unitId: string, assignmentId: string): Promise<HttpResponse<Data>> {
    const url = this.getUrl(studentId, unitId, assignmentId);
    return this.httpService.get<Data>(url);
  }

  private getUrl(studentId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/students/${studentId}/newUnits/${unitId}/assignments/${assignmentId}`;
  }
}
