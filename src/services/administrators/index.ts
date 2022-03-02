import { axiosHttpService } from '..';
import { CourseService } from './courseService';
import { NewAssignmentTemplateService } from './newAssignmentTemplateService';
import { NewPartTemplateService } from './newPartTemplateService';
import { NewUnitTemplateService } from './newUnitTemplateService';
import { SchoolService } from './schoolService';

export const schoolService = new SchoolService(axiosHttpService);
export const courseService = new CourseService(axiosHttpService);
export const newUnitTemplateService = new NewUnitTemplateService(axiosHttpService);
export const newAssignmentTemplateService = new NewAssignmentTemplateService(axiosHttpService);
export const newPartTemplateService = new NewPartTemplateService(axiosHttpService);

export type { SchoolWithCourses } from './schoolService';
export type { CourseWithUnits } from './courseService';
export type { NewUnitTemplateWithAssignments } from './newUnitTemplateService';
export type { NewAssignmentTemplateWithParts } from './newAssignmentTemplateService';
export type { NewPartTemplateWithInputs } from './newPartTemplateService';
