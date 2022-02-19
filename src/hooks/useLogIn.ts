import { useState } from 'react';
import { AuthenticationPayload } from '../domain/authenticationPayload';
import { axiosHttpService } from '../services';
import { useAuthDispatch } from './useAuthDispatch';

const url = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/auth/login'
  : 'https://student.qccareerschool.com/sc/auth/login';

type LogInFunction = (username: string, password: string) => Promise<boolean>;

export const useLogIn = (): [LogInFunction, boolean] => {
  const [ submitting, setSubmitting ] = useState(false);
  const authDispatch = useAuthDispatch();

  const logIn: LogInFunction = async (username, password): Promise<boolean> => {
    setSubmitting(true);
    const body = { username, password };
    try {
      const response = await axiosHttpService.post<AuthenticationPayload>(url, body);
      if (response.data) {
        if (response.data.type === 'administrator') {
          authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: { accountId: response.data.id, xsrfToken: response.data.xsrf } });
        } else if (response.data.type === 'tutor') {
          authDispatch({ type: 'TUTOR_LOG_IN', payload: { accountId: response.data.id, xsrfToken: response.data.xsrf } });
        } else if (response.data.type === 'student') {
          authDispatch({ type: 'STUDENT_LOG_IN', payload: { accountId: response.data.id, xsrfToken: response.data.xsrf } });
        }
        return true;
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return [ logIn, submitting ];
};
