import type { Certificate } from '@/domain/certificate';
import { isRawCertificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

interface FetchCertificateFunction {
  (signature: string): Promise<Certificate>;
  (studentId: number, courseId: number): Promise<Certificate>;
}

export const fetchCertificate: FetchCertificateFunction = async (signatureOrStudentId: string | number, courseId?: number): Promise<Certificate> => {
  const url = typeof signatureOrStudentId === 'string'
    ? `${endpoint}/certificates/${signatureOrStudentId}`
    : `${endpoint}/students/${signatureOrStudentId}/courses/${courseId}/certificate`;

  const response = await fetch(url, {
    credentials: 'include',
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

  return { ...body, graduationDate: new Date(body.graduationDate) };
};
