import { isCertificate } from '../../../../isCertificate';
import type { Certificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

export const fetchCertificate = async (courseId: string, studentId: string): Promise<Certificate> => {
<<<<<<<< HEAD:src/app/students/courses/[courseId]/certificate/fetchCertificate.ts
  const url = `/sc/api/v1/students/${studentId}/courses/${courseId}`;
  console.log('fetchCertificate url:', url);
  console.log('courseId:', courseId, 'studentId:', studentId);
  const response = await fetch(url);
  console.log('response status:', response.status);
  console.log('response url:', response.url);
========
  const url = `${endpoint}/students/${studentId}/courses/${courseId}/certificates`;
  const response = await fetch(url, {
    credentials: 'include',
  });
>>>>>>>> d3fdc31a8b1a5ad1bc9af7c5922c87cd98e3b818:src/app/students/courses/[courseId]/certificates/fetchCertificate.ts
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const body: unknown = await response.json();
  if (!isCertificate(body)) {
    throw Error('Unexpected response');
  }
  console.log(body);

<<<<<<<< HEAD:src/app/students/courses/[courseId]/certificate/fetchCertificate.ts
  return body;
========
  return {
    ...body,
  };
>>>>>>>> d3fdc31a8b1a5ad1bc9af7c5922c87cd98e3b818:src/app/students/courses/[courseId]/certificates/fetchCertificate.ts
};
