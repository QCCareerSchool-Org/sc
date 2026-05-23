'use client';

import type { ChangeEventHandler } from 'react';
import type { SubmitEventHandler } from 'react';
import { type FC, useEffect, useRef, useState } from 'react';
import { FaCommentDots, FaMinus } from 'react-icons/fa';

import styles from './index.module.css';
import { Message } from './message';
import { Progress } from './progress';
import { useAuthState } from '@/hooks/useAuthState';
import { useStudentServices } from '@/hooks/useStudentServices';
import type { StudentPayload } from 'src/lib/chatbot/studentPayload.mjs';

interface Message {
  text: string;
  type: 'user' | 'bot' | 'system';
}

const disclaimer = 'Meet your course helper! This AI chatbot is here to help with any questions you might have as you complete your course. AI-generated responses may occasionally contain errors. If you need more help, simply reach out to our student support team!';
const getGreeting = (student: StudentPayload) => `Hi ${student.firstName}! what can I help you with today?`;

export const Chatbot: FC = () => {
  const { studentId } = useAuthState();
  const { studentService } = useStudentServices();
  const [ messages, setMessages ] = useState<Message[]>([ { type: 'system', text: disclaimer } ]);
  const [ nextMessage, setNextMessage ] = useState('');
  const [ isSending, setIsSending ] = useState(false);
  const [ isMinimized, setIsMinimized ] = useState(false);
  const [ student, setStudent ] = useState<StudentPayload>();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const subscription = studentService.getStudent(studentId).subscribe(data => {
      const s = data as unknown as StudentPayload;
      // temporary
      for (const e of s.enrollments) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!e.submissions) {
          e.submissions = [];
        }
      }
      setStudent(s);
      setMessages(m => [ ...m, { type: 'bot', text: getGreeting(s) } ]);
    });

    return () => subscription.unsubscribe();
  }, [ studentId, studentService ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [ messages, isSending ]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  const handleSubmit = () => {
    const message = nextMessage.trim();

    if (!message || isSending || !student) {
      return;
    }

    setIsSending(true);
    setNextMessage('');

    const body = { message, student };

    setMessages(m => ([ ...m, { type: 'user', text: message } ]));

    (async () => {
      const response = await fetch('/sc/students/chatbot', {
        method: 'post',
        headers: [
          [ 'Content-Type', 'application/json' ],
        ],
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw Error(getResponseErrorMessage(response));
      }

      try {
        const responseBody: unknown = await response.json();
        if (!(responseBody !== null && typeof responseBody === 'object'
          && 'answer' in responseBody && typeof responseBody.answer === 'string')) {
          throw Error('Invalid response');
        }
        const answer = responseBody.answer;

        setMessages(m => ([ ...m, { type: 'bot', text: answer } ]));
      } catch {
        throw Error('Couldn\'t parse response');
      }
    })()
      .catch((error: unknown) => {
        console.error(error);
        setNextMessage(message);
        setMessages(m => ([ ...m, { type: 'system', text: getRequestErrorMessage(error) } ]));
      })
      .finally(() => setIsSending(false));
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setNextMessage(e.target.value);
  };

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    handleSubmit();
  };

  const handleMinimizeClick = () => {
    setIsMinimized(true);
  };

  const handleRestoreClick = () => {
    setIsMinimized(false);
  };

  if (isMinimized) {
    return (
      <button type="button" className={styles.launcher} onClick={handleRestoreClick}>
        <FaCommentDots aria-hidden="true" />
        <span>{isSending ? 'Replying' : 'Chat'}</span>
      </button>
    );
  }

  return (
    <div className={styles.chatbot}>
      <header className={styles.header}>
        <div>
          <h1>Student Chat</h1>
          <p>{student ? 'Online' : 'Loading student profile'}</p>
        </div>
        <button type="button" className={styles.minimizeButton} title="Minimize chat" aria-label="Minimize chat" onClick={handleMinimizeClick}>
          <FaMinus aria-hidden="true" />
        </button>
      </header>
      <div className={styles.messagePane}>
        {messages.map((m, i) => <Message key={i} text={m.text} type={m.type} />)}
        {isSending && <Progress />}
        <div ref={messageEndRef} />
      </div>
      <form className={styles.footer} onSubmit={handleFormSubmit}>
        <textarea
          aria-label="Message"
          placeholder="Ask a question"
          value={nextMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={!student || isSending || !nextMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

const getResponseErrorMessage = (response: Response): string => {
  if (response.status === 400) {
    return 'I could not understand that request. Please try rephrasing it.';
  }

  if (response.status === 401 || response.status === 403) {
    return 'Please sign in again before sending another message.';
  }

  if (response.status >= 500) {
    return 'The chat service is having trouble right now. Please try again in a moment.';
  }

  return response.statusText || 'The message could not be sent.';
};

const getRequestErrorMessage = (error: unknown): string => {
  return error instanceof Error
    ? error.message
    : 'The message could not be sent.';
};
