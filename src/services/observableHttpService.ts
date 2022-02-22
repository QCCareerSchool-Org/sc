import type Axios from '@qccareerschool/axios-observable';
import type { AxiosResponse } from 'axios';
import { catchError, combineLatest, map, Observable, startWith, Subject, throwError } from 'rxjs';

import { AxiosOtherError, AxiosRefreshError } from '../observableAxiosInstance';

type Config = {
  params?: any;
  headers?: Record<string, string | number | boolean>;
};

export class ObservableHttpServiceError extends Error {
  public constructor(message: string, public readonly refresh: boolean, public readonly code?: number) {
    super(message);
  }
}

export interface IObservableHttpService {
  get: <T = unknown>(url: string, config?: Config) => Observable<T>;
  post: <T = unknown>(url: string, body?: unknown, config?: Config) => Observable<T>;
  postFile: (url: string, body: unknown, config?: Config) => Observable<number>;
  put: <T = unknown>(url: string, body?: unknown, config?: Config) => Observable<T>;
  putFile: (url: string, body: unknown, config?: Config) => Observable<number>;
  delete: <T = unknown>(url: string, config?: Config) => Observable<T>;
}

export class ObservableAxiosHttpService implements IObservableHttpService {

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

    const data = this.instance.post(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    // combine the request with the progress observable created above
    // we need both observables to emit at least one value each, so use startWith to cause the first observable to emit right away
    return combineLatest([
      data.pipe(startWith(undefined)),
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

    const data = this.instance.put(url, body, { ...config, onUploadProgress }).pipe(
      map((response, index) => this.handleResponse(response, index)),
      catchError((err, caught) => this.handleError(err, caught)),
    );

    // combine the request with the progress observable created above
    // we need both observables to emit at least one value each, so use startWith to cause the first observable to emit right away
    return combineLatest([
      data.pipe(startWith(undefined)),
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

  private handleResponse<T>(response: AxiosResponse<T>, index: number): T {
    return response.data;
  }

  private handleError<T>(err: Error, caught: Observable<T>): Observable<never> {
    if (err instanceof AxiosRefreshError) {
      return throwError(() => new ObservableHttpServiceError('', true));
    }
    if (err instanceof AxiosOtherError) {
      return throwError(() => new ObservableHttpServiceError('', false, err.response?.status));
    }
    return throwError(() => new ObservableHttpServiceError('', false));
  }
}
