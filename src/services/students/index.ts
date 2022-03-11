import { axiosHttpService } from '..';
import { EnrollmentService } from './enrollmentService';
import { NewAssignmentService } from './newAssignmentService';
import { NewUnitService } from './newUnitService';

export const enrollmentService = new EnrollmentService(axiosHttpService);
export const newUnitService = new NewUnitService(axiosHttpService);
export const newAssignmentService = new NewAssignmentService(axiosHttpService);
