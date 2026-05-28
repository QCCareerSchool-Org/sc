import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { QCMetadata } from 'src/lib/chatbot/index.mjs';
import { run } from 'src/lib/chatbot/index.mjs';
import type { StudentPayload } from 'src/lib/chatbot/studentPayload.mjs';
import { isStudentPayload } from 'src/lib/chatbot/studentPayload.mjs';

const cookieMaxAge = 60 * 60 * 4;

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const [ body, cookieStore ] = await Promise.all([
      request.json().catch(() => null) as Promise<unknown>,
      cookies(),
    ]);

    if (!isValid(body)) {
      return NextResponse.json(
        { error: 'Bad request' },
        { status: 400 },
      );
    }

    const metadata: QCMetadata = { studentId: body.student.studentId.toString() };

    let conversationId = cookieStore.get('conversationId')?.value ?? null;

    const chatResponse = await run(
      body.message,
      body.student,
      metadata,
      conversationId,
    );

    if (chatResponse.conversationId) {
      conversationId = chatResponse.conversationId;

      cookieStore.set('conversationId', conversationId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: cookieMaxAge,
      });
    }

    return NextResponse.json({
      status: chatResponse.status,
      answer: chatResponse.answer,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Unable to process chat request' },
      { status: 500 },
    );
  }
};

interface RequestBody {
  message: string;
  student: StudentPayload;
}

const isValid = (u: unknown): u is RequestBody => {
  return u !== null && typeof u === 'object'
    && 'message' in u && typeof u.message === 'string'
    && 'student' in u && isStudentPayload(u.student);
};
