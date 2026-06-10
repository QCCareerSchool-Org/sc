import type { Certificate, RawCertificate } from '@/domain/certificate';
import { isRawCertificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

interface FetchCertificateFunction {
  (signature: string): Promise<Certificate>;
  (studentId: number, courseId: number): Promise<Certificate>;
}

interface FetchRawCertificateFunction {
  (signature: string): Promise<RawCertificate>;
  (studentId: number, courseId: number): Promise<RawCertificate>;
}

export const fetchRawCertificate: FetchRawCertificateFunction = async (signatureOrStudentId: string | number, courseId?: number): Promise<RawCertificate> => {
  return {
    courseName: 'Course Name',
    designation: {
      name: 'Lorem Ipsum',
      code: 'LI',
    },
    firstName: 'John',
    lastName: 'Doe',
    graduationDate: '2026-01-01T02:32:23-0400',
    schoolName: 'QC Design School',
    signature: 'sdfidyus',
  };

  // const url = typeof signatureOrStudentId === 'string'
  //   ? `${endpoint}/certificates/${signatureOrStudentId}`
  //   : `${endpoint}/students/${signatureOrStudentId}/courses/${courseId}/certificate`;

  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw Error(response.statusText);
  // }

  // const body: unknown = await response.json();
  // if (!isRawCertificate(body)) {
  //   throw Error('Unexpected response');
  // }

  // return body;
};

export const fetchCertificate: FetchCertificateFunction = async (signatureOrStudentId: string | number, courseId?: number): Promise<Certificate> => {
  let certificate: RawCertificate;

  if (typeof signatureOrStudentId === 'string') {
    certificate = await fetchRawCertificate(signatureOrStudentId);
  } else {
    if (courseId === undefined) {
      throw Error('courseId is required');
    }

    certificate = await fetchRawCertificate(signatureOrStudentId, courseId);
  }

  return { ...certificate, graduationDate: new Date(certificate.graduationDate) };
};
