import type { AxiosResponse } from 'axios';
import type axios from 'axios-observable';
import { saveAs } from 'file-saver';
import type { Observable } from 'rxjs';
import { catchError, from, map, merge, Subject, tap, throwError } from 'rxjs';

import { AbstractAxiosError, AxiosOtherError, AxiosRefreshError } from '../axiosInstance';
import { endpoint } from '../basePath';

export type HttpServiceConfig = {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string | number | boolean>;
  withCredentials?: boolean;
};

export class HttpServiceError extends Error {
  public constructor(message: string, public readonly login: boolean, public readonly code?: number) {
    super(message);
  }
}

export type ProgressResponse<T> = { type: 'progress'; value: number } | { type: 'data'; value: T };

export interface IHttpService {
  get: <T = unknown>(url: string, config?: HttpServiceConfig) => Observable<T>;
  post: <T = unknown>(url: string, body?: unknown, config?: HttpServiceConfig) => Observable<T>;
  postFile: <T = unknown>(url: string, body: unknown, config?: HttpServiceConfig) => Observable<ProgressResponse<T>>;
  put: <T = unknown>(url: string, body?: unknown, config?: HttpServiceConfig) => Observable<T>;
  putFile: <T = unknown>(url: string, body: unknown, config?: HttpServiceConfig) => Observable<ProgressResponse<T>>;
  patch: <T = unknown>(url: string, body?: unknown, config?: HttpServiceConfig) => Observable<T>;
  delete: <T = unknown>(url: string, config?: HttpServiceConfig) => Observable<T>;
  download: (url: string, config?: HttpServiceConfig) => Observable<void>;
}

export class AxiosHttpService implements IHttpService {

  public constructor(private readonly instance: axios) { /* */ }

  public get<T>(url: string, config?: HttpServiceConfig): Observable<T> {
    return this.instance.get<T>(url, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public post<T>(url: string, body: unknown, config?: HttpServiceConfig): Observable<T> {
    return this.instance.post<T>(url, body, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public postFile<T>(url: string, body: unknown, config?: HttpServiceConfig): Observable<ProgressResponse<T>> {
    // for keeping track of the upload progress
    const progress$ = new Subject<number>();

    // callback to update the progress tracker
    const onUploadProgress = (progressEvent: ProgressEvent): void => {
      const completed = Math.round(progressEvent.loaded * 100 / progressEvent.total);
      if (completed >= 100) {
        progress$.next(100);
        progress$.complete();
      } else {
        progress$.next(completed);
      }
    };

    // make the request including the progress tracker callback
    const data$ = this.instance.post<T>(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    // merge both observables
    return merge(
      data$.pipe(map(value => ({ type: 'data', value } as const))),
      progress$.pipe(map(value => ({ type: 'progress', value } as const))),
    );
  }

  public put<T>(url: string, body: unknown, config?: HttpServiceConfig): Observable<T> {
    return this.instance.put<T>(url, body, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public putFile<T>(url: string, body: unknown, config?: HttpServiceConfig): Observable<ProgressResponse<T>> {
    const progress$ = new Subject<number>();
    const onUploadProgress = (progressEvent: ProgressEvent): void => {
      const completed = Math.round(progressEvent.loaded * 100 / progressEvent.total);
      if (completed >= 100) {
        progress$.next(100);
        progress$.complete();
      } else {
        progress$.next(completed);
      }
    };

    const data$ = this.instance.put<T>(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    return merge(
      data$.pipe(map(value => ({ type: 'data', value } as const))),
      progress$.pipe(map(value => ({ type: 'progress', value } as const))),
    );
  }

  public delete<T>(url: string, config?: HttpServiceConfig): Observable<T> {
    return this.instance.delete<T>(url, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public patch<T>(url: string, body: unknown, config?: HttpServiceConfig): Observable<T> {
    return this.instance.patch<T>(url, body, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  /**
   * Makes a get request and initiates a file download on the client side
   *
   * Note: because we're receiving a blob, we have to do extra processing to reconstruct error messages
   * @param url the url to download from
   * @param config the configuration options
   * @returns A void Observable
   */
  public download(url: string, config?: HttpServiceConfig): Observable<void> {
    return this.instance.get(url, { ...config, responseType: 'blob' }).pipe(
      tap(response => {
        const filename = /filename="(.*)"/u.exec(response.headers['content-disposition'])?.[1];
        if (response.data instanceof Blob) {
          saveAs(response.data, filename ? decodeURIComponent(filename) : undefined);
        }
      }),
      map(() => undefined),
      catchError((err, caught) => {
        // for requests to third parties, do the standard error handling
        if (!url.startsWith(endpoint)) {
          return this.handleError(err, caught);
        }

        // otherwise try to use the blob response to reconstruct the error messsage

        if (err instanceof AbstractAxiosError) {

          // check if there's a response
          if (typeof err.response?.data === 'undefined') {
            return throwError(() => new HttpServiceError(err.message, false));
          }

          if (err.response.data instanceof Blob) {
            const blob = err.response?.data;

            // turn the blob back into text
            // because Blob.prototype.text returns a Promise, we conver it to an Observable
            const errorMessage$ = from(blob.text());

            // return the a new HttpServiceError
            return errorMessage$.pipe(
              map(message => {
                if (err instanceof AxiosRefreshError) {
                  throw new HttpServiceError(message, true);
                }
                if (err instanceof AxiosOtherError) {
                  throw new HttpServiceError(message, false, err.response?.status);
                }
                throw new HttpServiceError(err.message, false);
              }),
            );
          }
        }
        if (err instanceof Error) {
          return throwError(() => new HttpServiceError(err.message, false));
        }
        return throwError(() => new HttpServiceError('Unknown error', false));
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleResponse<T>(response: AxiosResponse<T>, index: number): T {
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleError<T>(err: unknown, caught: Observable<T>): Observable<never> {
    if (err instanceof AbstractAxiosError) {
      const message = typeof err.response?.data === 'string' ? err.response?.data : '';
      if (err instanceof AxiosRefreshError) {
        return throwError(() => new HttpServiceError(message, true));
      }
      return throwError(() => new HttpServiceError(message, false, err.response?.status));
    }
    if (err instanceof Error) {
      return throwError(() => new HttpServiceError(err.message, false));
    }
    return throwError(() => new HttpServiceError('Unknown error', false));
  }
}
