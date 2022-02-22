import { observableAxiosHttpService } from '..';
import { NewAssignmentService } from './newAssignmentService';
import { NewUnitService } from './newUnitService';

export const newUnitService = new NewUnitService(observableAxiosHttpService);
export const newAssignmentService = new NewAssignmentService(observableAxiosHttpService);

export type { NewUnitWithAssignments } from './newUnitService';
export type { NewAssignmentWithChildren } from './newAssignmentService';
