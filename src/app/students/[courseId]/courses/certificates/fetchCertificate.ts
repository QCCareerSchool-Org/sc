import { isCertificate } from './isCertificate';
import type { Certificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

export const fetchCertificate = async (courseId: string, studentId: string): Promise<Certificate> => {
  const url = `${endpoint}/api/v1/students/${studentId}/courses/${courseId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const body: unknown = await response.json();
  if (!isCertificate(body)) {
    throw Error('Unexpected response');
  }
  console.log(body);

  return {
    ...body,
  };
};