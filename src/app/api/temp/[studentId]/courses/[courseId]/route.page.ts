import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// import { isCertificate } from '../../../../../../students/courses/[courseId]/certificate/isCertificate';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  params: Promise<{ courseId: string; studentId: string }>;
};

export const GET = async (
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> => {

  try {
    const { courseId, studentId } = await params;
    const url = `http://localhost:8080/v1/students/${studentId}/courses/${courseId}/certificate`;
    const response = await fetch(url, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    });
    console.log('cookies being forwarded:', request.headers.get('cookie'));
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: response.status },
      );
    }

    const body: unknown = await response.json();

    // if (!isCertificate(body)) {
    //   return NextResponse.json(
    //     { error: 'Unexpected response' },
    //     { status: response.status },
    //   );
    // }

    return NextResponse.json(body);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Unable to process request' },
      { status: 500 },
    );
  }
};
