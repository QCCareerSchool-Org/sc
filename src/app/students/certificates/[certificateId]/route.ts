import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isRawAward } from './submission';

export const GET = async (
  request: NextRequest,
  { params }: { params: { submissionId: string } },
): Promise<NextResponse> => {

  try {
    const { submissionId } = params;
    const url = `http://localhost:8080/v1/awards/${encodeURIComponent(submissionId)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: response.status },
      );
    }

    const body: unknown = await response.json();

    if (!isRawAward(body)) {
      return NextResponse.json(
        { error: 'Unexpected response' },
        { status: response.status },
      );
    }

    return NextResponse.json(body);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Unable to process request' },
      { status: 500 },
    );
  }
};
