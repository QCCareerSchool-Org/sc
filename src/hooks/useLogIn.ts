import { useState } from 'react';
import { useAuthDispatch } from './useAuthDispatch';
import { useAxiosInstance } from './useRequest';

const url = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/auth/login'
  : 'https://student.qccareerschool.com/sc/auth/login';

type LogInFunction = (username: string, password: string) => Promise<boolean>;

type AuthenticationPayload = {
  crmId: number | null;
  exp: number;
  id: number;
  studentType: 'general' | 'design' | 'event' | 'writing';
  type: 'administrator' | 'tutor' | 'student';
  xsrf: string;
};

export const useLogIn = (): [LogInFunction, boolean] => {
  const [ submitting, setSubmitting ] = useState(false);
  const authDispatch = useAuthDispatch();

  const axios = useAxiosInstance();

  const logIn: LogInFunction = async (username, password) => {
    setSubmitting(true);
    const body = { username, password };
    try {
      const response = await axios.post<AuthenticationPayload>(url, body);
      console.log(response.data);
      if (response.data.type === 'administrator') {
        authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: response.data.id });
      } else if (response.data.type === 'tutor') {
        authDispatch({ type: 'TUTOR_LOG_IN', payload: response.data.id });
      } else if (response.data.type === 'student') {
        authDispatch({ type: 'STUDENT_LOG_IN', payload: response.data.id });
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return [ logIn, submitting ];
};
