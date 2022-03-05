import type Axios from '@qccareerschool/axios-observable';
import type { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import { catchError, combineLatest, from, map, mapTo, Observable, startWith, Subject, tap, throwError } from 'rxjs';

import { AbstractAxiosError, AxiosOtherError, AxiosRefreshError } from 'src/axiosInstance';
import { endpoint } from 'src/basePath';

type Config = {
  params?: any;
  headers?: Record<string, string | number | boolean>;
};

export class HttpServiceError extends Error {
  public constructor(message: string, public readonly refresh: boolean, public readonly code?: number) {
    super(message);
  }
}

export interface IHttpService {
  get: <T = unknown>(url: string, config?: Config) => Observable<T>;
  post: <T = unknown>(url: string, body?: unknown, config?: Config) => Observable<T>;
  postFile: (url: string, body: unknown, config?: Config) => Observable<number>;
  put: <T = unknown>(url: string, body?: unknown, config?: Config) => Observable<T>;
  putFile: (url: string, body: unknown, config?: Config) => Observable<number>;
  delete: <T = unknown>(url: string, config?: Config) => Observable<T>;
  download: (url: string, config?: Config) => Observable<void>;
}

export class AxiosHttpService implements IHttpService {

  public constructor(private readonly instance: Axios) { /* */ }

  public get<T>(url: string, config?: Config): Observable<T> {
    return this.instance.get<T>(url, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public post<T>(url: string, body: unknown, config?: Config): Observable<T> {
    return this.instance.post<T>(url, body, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public postFile(url: string, body: unknown, config?: Config): Observable<number> {
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

    const data$ = this.instance.post(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    // combine the request with the progress observable created above
    // we need both observables to emit at least one value each, so use startWith to cause the first observable to emit right away
    return combineLatest([
      data$.pipe(startWith(undefined)),
      progress$,
    ]).pipe(
      map(([ , progress ]) => progress), // we only care about the second observable
    );
  }

  public put<T>(url: string, body: unknown, config?: Config): Observable<T> {
    return this.instance.put<T>(url, body, config).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );
  }

  public putFile(url: string, body: unknown, config?: Config): Observable<number> {
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

    const data$ = this.instance.put(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    // combine the request with the progress observable created above
    // we need both observables to emit at least one value each, so use startWith to cause the first observable to emit right away
    return combineLatest([
      data$.pipe(startWith(undefined)),
      progress$,
    ]).pipe(
      map(([ , progress ]) => progress), // we only care about the second observable
    );
  }

  public delete<T>(url: string, config?: Config): Observable<T> {
    return this.instance.delete<T>(url, config).pipe(
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
  public download(url: string, config?: Config): Observable<void> {
    return this.instance.get(url, { ...config, responseType: 'blob' }).pipe(
      tap(response => {
        const filename = /filename="(.*)"/u.exec(response.headers['content-disposition'])?.[1];
        saveAs(response.data, filename);
      }),
      mapTo(undefined),
      catchError((err, caught) => {
        // for requests to third parties, do the standard error handling
        if (!url.startsWith(endpoint)) {
          return this.handleError(err, caught);
        }

        // otherwise try to use the blob response to reconstruct the error messsage

        if (err instanceof AbstractAxiosError) {

          // check if there's a response
          const blob = err.response?.data;
          if (typeof blob === 'undefined') {
            return throwError(() => new HttpServiceError(err.message, false));
          }

          // turn the blob back into text
          // because Blob.prototype.text returns a Promise, we conver it to an Observable
          const errorMessage$ = from((blob as Blob).text());

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
        return throwError(() => new HttpServiceError(err.message, false));
      }),
    );
  }

  private handleResponse<T>(response: AxiosResponse<T>, index: number): T {
    return response.data;
  }

  private handleError<T>(err: Error, caught: Observable<T>): Observable<never> {
    if (err instanceof AbstractAxiosError) {
      const data = err.response?.data;
      const message = typeof data === 'string' ? data : '';
      if (err instanceof AxiosRefreshError) {
        return throwError(() => new HttpServiceError(message, true));
      } else if (err instanceof AxiosOtherError) {
        return throwError(() => new HttpServiceError(message, false, err.response?.status));
      }
    }
    return throwError(() => new HttpServiceError(err.message, false));
  }
}
