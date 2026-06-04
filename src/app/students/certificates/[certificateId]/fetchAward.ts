import { isRawAward } from './submission';
import type { Award } from '@/domain/award';
import { endpoint } from 'src/basePath';

export const fetchAward = async (submissionId: string): Promise<Award> => {
  const url = `${endpoint}/oldAwards/${submissionId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const body: unknown = await response.json();
  console.log(body);
  if (!isRawAward(body)) {
    throw Error('Unexpected response');
  }
  if (!body.created) {
    throw new Error('Missing created date');
  }
  return {
    ...body,
    schoolName: body.schoolName,
    submissionId: String(body.submissionId),
    created: new Date(body.created),
    designation: body.designation,
  };
};
