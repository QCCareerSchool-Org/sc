import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { endpoint } from '../basePath';

export const useAxiosInstance = (): AxiosInstance => {
  const router = useRouter();

  const instance = useRef<AxiosInstance>(axios.create());

  useEffect(() => {
    instance.current.interceptors.response.use(undefined, async error => {
      const originalRequest = error.config;

      // handle refresh errors
      if (error.response.status === 400 && originalRequest.url === `${endpoint}auth/refresh`) {
        void router.push('/login');
        return Promise.reject(error);
      }

      // handle 401 errors
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        return instance.current.post(`${endpoint}auth/refresh`).then(response => {
          if (response.status === 200) {
            return instance.current(originalRequest);
          }
        });
      }

      return Promise.reject(error); // throw error?
    });

  }, [ router ]);

  return instance.current;
};
