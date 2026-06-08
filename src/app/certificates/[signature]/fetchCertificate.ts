import type { Certificate } from '@/domain/certificate';
import { isCertificate } from 'src/app/isCertificate';
import { endpoint } from 'src/basePath';

export const fetchCertificate = async (signature: string): Promise<Certificate> => {
  const url = `${endpoint}/certificates/${signature}`;
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
