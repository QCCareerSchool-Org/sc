import { isRawAward } from './submission';
import type { Award } from '@/domain/award';
import { endpoint } from 'src/basePath';

export const fetchOldAward = async (submissionId: number): Promise<Award> => {
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
  console.log(body.schoolName);

  return {
    ...body,
    submissionId: String(body.submissionId),
    schoolName: body.schoolName,
    created: new Date(body.created),
  };
};
