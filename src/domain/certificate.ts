import { isSchoolName, type SchoolName } from './school';

interface Designation {
  name: string;
  code: string;
}

export interface RawCertificate {
  firstName: string;
  lastName: string;
  graduationDate: string;
  courseName: string;
  schoolName: SchoolName;
  designation?: Designation;
  signature: string;
}

export interface Certificate {
  firstName: string;
  lastName: string;
  graduationDate: Date;
  courseName: string;
  schoolName: SchoolName;
  designation?: Designation;
  signature: string;
}

export const isRawCertificate = (obj: unknown): obj is RawCertificate => {
  return typeof obj === 'object' && obj !== null &&
    'firstName' in obj && typeof obj.firstName === 'string' &&
    'lastName' in obj && typeof obj.lastName === 'string' &&
    'graduationDate' in obj && typeof obj.graduationDate === 'string' &&
    'courseName' in obj && typeof obj.courseName === 'string' &&
    'schoolName' in obj && isSchoolName(obj.schoolName) &&
    (!('designation' in obj) || isDesignation(obj.designation)) &&
    'signature' in obj && typeof obj.signature === 'string';
};

const isDesignation = (obj: unknown): obj is Designation => {
  return typeof obj === 'object' && obj !== null &&
    'name' in obj && typeof obj.name === 'string' &&
    'code' in obj && typeof obj.code === 'string';
};
