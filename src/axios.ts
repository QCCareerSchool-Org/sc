import axios from 'axios';
import { endpoint } from './basePath';

const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, async error => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async error => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const originalRequest = error.config;

  if (error.response.status === 400 && originalRequest.url === `${endpoint}auth/refresh`) {
    // void router.push('/login');
    return Promise.reject(error);
  }

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    return instance.post(`${endpoint}auth/refresh`).then(response => {
      if (response.status === 200) {
        return instance(originalRequest);
      }
    });
  }

  return Promise.reject(error); // throw error?
});

export { instance as axios };
