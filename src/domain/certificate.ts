export interface Certificate {
  firstName: string;
  lastName: string;
  graduationDate: Date;
  courseName: string;
  schoolName: string;
  designation: {
    name: string;
    code: string;
  };
  signature: string;
}

export const isCertificate = (obj: unknown): obj is Certificate => {
  return typeof obj === 'object' && obj !== null &&
    'firstName' in obj && typeof obj.firstName === 'string' &&
    'lastName' in obj && typeof obj.lastName === 'string' &&
    'graduationDate' in obj && (obj.graduationDate instanceof Date || typeof obj.graduationDate === 'string') &&
    'courseName' in obj && typeof obj.courseName === 'string' &&
    'schoolName' in obj && typeof obj.schoolName === 'string' &&
    'designation' in obj && typeof obj.designation === 'object' && obj.designation !== null &&
    'name' in obj.designation && typeof obj.designation.name === 'string' &&
    'code' in obj.designation && typeof obj.designation.code === 'string' &&
    'signature' in obj && typeof obj.signature === 'string';
};
