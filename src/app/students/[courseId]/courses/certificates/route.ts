import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

<<<<<<<< HEAD:src/app/api/v1/students/[studentId]/courses/[courseId]/route.ts
import { isCertificate } from '../../../../../../students/[courseId]/courses/certificates/isCertificate';
========
import { isCertificate } from './isCertificate';
>>>>>>>> 78c580d (student view):src/app/students/[courseId]/courses/certificates/route.ts

export const GET = async (
  request: NextRequest,
  { params }: { params: { courseId: string; studentId: string } },
): Promise<NextResponse> => {

  try {
    const { courseId, studentId } = params;
    const url = `http://localhost:8080/v1/certificates/${studentId}/courses/${courseId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: response.status },
      );
    }

    const body: unknown = await response.json();

    if (!isCertificate(body)) {
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
