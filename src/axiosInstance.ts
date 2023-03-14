import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosObservable from 'axios-observable';
import { firstValueFrom, switchMap } from 'rxjs';

import { crmEndpoint, endpoint } from './basePath';

export const instance = axiosObservable.create({});

instance.interceptors.request.use(config => {
  // add cookies to requests to our back end
  // axios automatically adds an x-xsrf-token header based on the XSRF-TOKEN cookie
  if (config.url?.startsWith(endpoint) || config.url?.startsWith(crmEndpoint)) {
    return { ...config, withCredentials: true };
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
    if (error.response?.status === 400 && originalRequest.url === `${endpoint}/auth/refresh`) {
      return Promise.reject(new AxiosRefreshError(error));
    }

    // handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // make a refresh request
      return firstValueFrom(instance.post(`${endpoint}/auth/refresh`).pipe(
        // then re-make the original request
        switchMap(() => instance.request(originalRequest)),
      ));
    }

    return Promise.reject(new AxiosOtherError(error));
  }

  if (error instanceof Error) {
    return Promise.reject(error);
  }

  if (typeof error === 'string') {
    return Promise.reject(Error(error));
  }

  return Promise.reject(Error('unknown'));
});

export abstract class AbstractAxiosError extends Error implements AxiosError {

  public constructor(private readonly originalError: AxiosError) {
    super(originalError.message);
  }

  public get name(): string { return this.originalError.name; }
  public get message(): string { return this.originalError.message; }
  public get stack(): string | undefined { return this.originalError.stack; }

  public get config(): AxiosRequestConfig { return this.originalError.config; }
  public get code(): string | undefined { return this.originalError.code; }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  public get request(): unknown { return this.originalError.request; }
  public get response(): AxiosResponse | undefined { return this.originalError.response; }
  public get isAxiosError(): boolean { return this.originalError.isAxiosError; }

  public toJSON(): object {
    return this.originalError.toJSON();
  }
}

export class AxiosRefreshError extends AbstractAxiosError { }
export class AxiosUnauthorizedError extends AbstractAxiosError { }
export class AxiosOtherError extends AbstractAxiosError { }
