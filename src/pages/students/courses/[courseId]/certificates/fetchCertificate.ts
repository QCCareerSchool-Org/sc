import type { Certificate } from '@/domain/certificate';
import { isCertificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

export const fetchCertificate = async (courseId: number, studentId: number): Promise<Certificate> => {
  const url = `${endpoint}/students/${studentId}/courses/${courseId}/certificates`;
  const response = await fetch(url, {
    credentials: 'include',
  });
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
