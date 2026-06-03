import { endpoint } from 'src/basePath';
import { isRawAward } from './submission';
import type { Award } from '@/domain/award';

export const fetchOldAward = async (submissionId: number): Promise<Award> => {
  const url = `${endpoint}/oldAwards/${submissionId}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(response.statusText);
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
    submissionId: String(body.submissionId),
    schoolName: body.name,
    created: new Date(body.created),
  };
};
