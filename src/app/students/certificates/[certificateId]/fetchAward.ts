import { isRawAward } from './submission';
import type { Award } from '@/domain/award';

export const fetchAward = async (submissionId: string): Promise<Award> => {
  const url = `http://localhost:3000/api/sc/v1/awards/${encodeURIComponent(submissionId)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const body: unknown = await response.json();
  if (!isRawAward(body)) {
    throw Error('Unexpected response');
  }
  if (!body.created) {
    throw new Error('Missing created date');
  }
  return {
    ...body,
    schoolName: body.name,
    submissionId: String(body.submissionId),
    created: new Date(body.created),
  };
};
