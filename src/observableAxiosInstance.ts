import axios from '@qccareerschool/axios-observable';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, switchMap } from 'rxjs';

import { endpoint } from './basePath';

export const instance = axios.create({});

instance.interceptors.request.use(config => {
  // add cookies to requests to our back end
  if (config.url?.startsWith(endpoint)) {
    return { ...config, withCredentials: true };
  }
  return config;
});

instance.interceptors.response.use(undefined, async error => {
  const originalRequest = error.config;

  // handle refresh errors
  if (error.response.status === 400 && originalRequest.url === `${endpoint}/auth/refresh`) {
    return Promise.reject(new AxiosRefreshError(error));
  }

  // handle 401 errors
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // make a refresh request
    return firstValueFrom(instance.post(`${endpoint}/auth/refresh`).pipe(
      switchMap(() => {
        return instance.request(originalRequest);
      }),
    ));
  }

  // all other errors
  return Promise.reject(new AxiosOtherError(error));
});

abstract class AbstractAxiosError<T = unknown, D = unknown> extends Error implements AxiosError<T, D> {

  public constructor(private readonly originalError: AxiosError) {
    super(originalError.message);
  }

  public get name(): string { return this.originalError.name; }
  public get message(): string { return this.originalError.message; }
  public get stack(): string | undefined { return this.originalError.stack; }

  public get config(): AxiosRequestConfig<D> { return this.originalError.config; }
  public get code(): string | undefined { return this.originalError.code; }
  public get request(): any { return this.originalError.request; }
  public get response(): AxiosResponse<T, D> | undefined { return this.originalError.response; }
  public get isAxiosError(): boolean { return this.originalError.isAxiosError; }

  public toJSON(): object {
    return this.originalError.toJSON();
  }
}

export class AxiosRefreshError extends AbstractAxiosError { }
export class AxiosOtherError extends AbstractAxiosError { }
