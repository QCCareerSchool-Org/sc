import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import axiosObservable from 'axios-observable';
import { firstValueFrom, switchMap } from 'rxjs';

import { AxiosOtherError, AxiosRefreshError, AxiosUnauthorizedError } from './axiosInstance';
import { crmEndpoint } from './basePath';

export const instance = axiosObservable.create({});

instance.interceptors.request.use(config => {
  // add cookies to requests to our back end
  // axios automatically adds an x-xsrf-token header based on the XSRF-TOKEN cookie
  if (config.url?.startsWith(crmEndpoint)) {
    return { ...config, withCredentials: true, xsrfCookieName: 'XSRF-TOKEN-CRMv4' };
  }
  return config;
});

instance.interceptors.response.use(undefined, async error => {
  if (axios.isAxiosError(error)) {
    const originalRequest = error.config as AxiosRequestConfig<unknown> & { _retry?: boolean };

    // handle unauthorized errors
    if (error.response?.status === 403) {
      return Promise.reject(new AxiosUnauthorizedError(error));
    }

    // handle refresh errors
    if (error.response?.status === 400 && originalRequest.url === `${crmEndpoint}/auth/refresh`) {
      return Promise.reject(new AxiosRefreshError(error));
    }

    // handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // make a refresh request
      return firstValueFrom(instance.post(`${crmEndpoint}/auth/refresh`).pipe(
        // then re-make the original request
        switchMap(() => instance.request(originalRequest)),
      ));
    }

    return Promise.reject(new AxiosOtherError(error));
  }

  return Promise.reject(error);
});
