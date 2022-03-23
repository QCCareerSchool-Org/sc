import { axiosHttpService } from '..';
import { NewAssignmentService } from './newAssignmentService';
import { NewUnitService } from './newUnitService';

export const newUnitService = new NewUnitService(axiosHttpService);
export const newAssignmentService = new NewAssignmentService(axiosHttpService);
