import { type Certificate, isCertificate } from '@/domain/certificate';
import { endpoint } from 'src/basePath';

interface FetchCertificateFunction {
  (signature: string): Promise<Certificate>;
  (studentId: number, courseId: number): Promise<Certificate>;
}

export const fetchCertificate: FetchCertificateFunction = async (signatureOrStudentId: string | number, courseId?: number): Promise<Certificate> => {
  const url = typeof signatureOrStudentId === 'string'
    ? `${endpoint}/certificates/${signatureOrStudentId}`
    : `${endpoint}/students/${signatureOrStudentId}/courses/${courseId}/certificate`;

  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const body: unknown = await response.json();
  if (!isCertificate(body)) {
    throw Error('Unexpected response');
  }
  console.log(body);

  return body;

};

// export const fetchCertificate = async (signature: string): Promise<Certificate> => {
//   const url = `${endpoint}/certificates/${signature}`;
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   const body: unknown = await response.json();
//   if (!isCertificate(body)) {
//     throw Error('Unexpected response');
//   }
//   console.log(body);

//   return {
//     ...body,
//   };
// };

// export const fetchCertificateFromSignature = async (signature: string): Promise<Certificate> => {
//   const url = `${endpoint}/certificates/${signature}`;
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   const body: unknown = await response.json();
//   if (!isCertificate(body)) {
//     throw Error('Unexpected response');
//   }
//   console.log(body);

//   return {
//     ...body,
//   };
// };
