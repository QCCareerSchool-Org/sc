import { AxiosInstance, AxiosResponse } from 'axios';
import { AxiosOtherError, AxiosRefreshError } from '../axiosInstance';

export type HttpResponse<T> = {
  success: true;
  data: T;
  code: number;
} | {
  success: false;
  code?: number;
  refresh: boolean;
};

export interface IHttpService {
  get: <T = unknown>(url: string, params?: Record<string, unknown>) => Promise<HttpResponse<T>>;
  post: <T = unknown>(url: string, body: unknown, params?: Record<string, unknown>) => Promise<HttpResponse<T>>;
  put: <T = unknown>(url: string, body: unknown, params?: Record<string, unknown>) => Promise<HttpResponse<T>>;
}

export class AxiosHttpService implements IHttpService {

  public constructor(private readonly instance: AxiosInstance) { /* */ }

  public async get<T>(url: string, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    return this.handleResponse(this.instance.get<T>(url, { params }));
  }

  public async post<T>(url: string, body: unknown, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    return this.handleResponse(this.instance.post<T>(url, body, { params }));
  }

  public async put<T>(url: string, body: unknown, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    return this.handleResponse(this.instance.post<T>(url, body, { params }));
  }

  private async handleResponse<T>(request: Promise<AxiosResponse<T>>): Promise<HttpResponse<T>> {
    try {
      const response = await request;
      return {
        success: true,
        data: response.data,
        code: response.status,
      };
    } catch (err) {
      if (err instanceof AxiosRefreshError) {
        return { success: false, code: 400, refresh: true };
      }
      if (err instanceof AxiosOtherError) {
        return { success: false, code: err.response?.status, refresh: false };
      }
      return { success: false, refresh: false };
    }
  }
}
