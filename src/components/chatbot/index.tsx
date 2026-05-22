'use client';

import type { ChangeEventHandler } from 'react';
import { type FC, useEffect, useState } from 'react';

import styles from './index.module.css';
import { Message } from './message';
import { Progress } from './progress';
import { useAuthState } from '@/hooks/useAuthState';
import { useStudentServices } from '@/hooks/useStudentServices';
import type { StudentPayload } from 'src/lib/chatbot/studentPayload.mjs';

interface Message {
  text: string;
  type: 'user' | 'bot';
}

export const Chatbot: FC = () => {
  const { studentId } = useAuthState();
  const { studentService } = useStudentServices();

  const [ messages, setMessages ] = useState<Message[]>([
    { type: 'user', text: 'Hello!' },
    { type: 'bot', text: 'How are you?' },
  ]);

  const [ nextMessage, setNextMessage ] = useState('');
  const [ isSending, setIsSending ] = useState(false);

  const [ student, setStudent ] = useState<StudentPayload>();

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const subscription = studentService.getStudent(studentId).subscribe(s => {
      setStudent(s as unknown as StudentPayload);
    });

    return () => subscription.unsubscribe();
  }, [ studentId, studentService ]);

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

    if (!message || isSending) {
      return;
    }

    setIsSending(true);
    setNextMessage('');

    const body = {
      message,
      student,
    };

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
        throw Error(response.statusText);
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
      .catch(console.error)
      .finally(() => setIsSending(false));
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setNextMessage(e.target.value);
  };

  return (
    <div className={styles.chatbot}>
      <h1>Chat</h1>
      <div className={styles.messagePane}>
        {messages.map((m, i) => <Message key={i} text={m.text} type={m.type} />)}
        {isSending && <Progress />}
      </div>
      <div className={styles.footer}>
        <textarea value={nextMessage} onChange={handleChange} onKeyDown={handleKeyDown} />
        <button onClick={handleSubmit} disabled={!student || isSending || !nextMessage.trim()}>Send</button>
      </div>
    </div>
  );
};
