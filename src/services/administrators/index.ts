import { axiosHttpService } from '..';
import { CourseService } from './courseService';
import { NewAssignmentTemplateService } from './newAssignmentTemplateService';
import { NewPartTemplateService } from './newPartTemplateService';
import { NewTextBoxTemplateService } from './newTextBoxTemplateService';
import { NewUnitTemplateService } from './newUnitTemplateService';
import { NewUploadSlotTemplateService } from './newUploadSlotTemplateService';
import { SchoolService } from './schoolService';

export const schoolService = new SchoolService(axiosHttpService);
export const courseService = new CourseService(axiosHttpService);
export const newUnitTemplateService = new NewUnitTemplateService(axiosHttpService);
export const newAssignmentTemplateService = new NewAssignmentTemplateService(axiosHttpService);
export const newPartTemplateService = new NewPartTemplateService(axiosHttpService);
export const newTextBoxTemplateService = new NewTextBoxTemplateService(axiosHttpService);
export const newUploadSlotTemplateService = new NewUploadSlotTemplateService(axiosHttpService);

export type { SchoolWithCourses } from './schoolService';
export type { CourseWithSchoolAndUnits } from './courseService';
export type { NewUnitTemplateWithCourseAndAssignments, NewUnitTemplatePayload } from './newUnitTemplateService';
export type { NewAssignmentTemplateWithUnitAndParts, NewAssignmentTemplatePayload } from './newAssignmentTemplateService';
export type { NewPartTemplateWithAssignmentAndInputs, NewPartTemplatePayload } from './newPartTemplateService';
export type { NewTextBoxTemplateWithPart, NewTextBoxTemplatePayload } from './newTextBoxTemplateService';
export type { NewUploadSlotTemplateWithPart, NewUploadSlotTemplatePayload, AllowedType } from './newUploadSlotTemplateService';
