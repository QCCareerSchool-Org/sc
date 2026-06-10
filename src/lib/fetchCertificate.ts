import type { Certificate, RawCertificate } from '@/domain/certificate';
import { isRawCertificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

interface FetchCertificateFunction {
  (clientCookies: string, signature: string): Promise<Certificate>;
  (clientCookies: string, studentId: number, courseId: number): Promise<Certificate>;
}

interface FetchRawCertificateFunction {
  (clientCookies: string, signature: string): Promise<RawCertificate>;
  (clientCookies: string, studentId: number, courseId: number): Promise<RawCertificate>;
}

export const fetchRawCertificate: FetchRawCertificateFunction = async (clientCookies: string, signatureOrStudentId: string | number, courseId?: number): Promise<RawCertificate> => {
  console.error(clientCookies);

  const url = typeof signatureOrStudentId === 'string'
    ? `${endpoint}/certificates/${signatureOrStudentId}`
    : `${endpoint}/students/${signatureOrStudentId}/courses/${courseId}/certificate`;
  console.error(url);

  const response = await fetch(url, {
    headers: {
      'Cookie': clientCookies,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error(await response.text());
    throw Error(response.statusText);
  }

  const body: unknown = await response.json();
  if (!isRawCertificate(body)) {
    console.error(await response.text());
    throw Error('Unexpected response');
  }

  return body;
};

export const fetchCertificate: FetchCertificateFunction = async (clientCookies: string, signatureOrStudentId: string | number, courseId?: number): Promise<Certificate> => {
  let certificate: RawCertificate;

  if (typeof signatureOrStudentId === 'string') {
    certificate = await fetchRawCertificate(clientCookies, signatureOrStudentId);
  } else {
    if (courseId === undefined) {
      throw Error('courseId is required');
    }

    certificate = await fetchRawCertificate(clientCookies, signatureOrStudentId, courseId);
  }

  return { ...certificate, graduationDate: new Date(certificate.graduationDate) };
};
