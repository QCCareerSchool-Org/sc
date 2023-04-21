import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { IHttpService } from './httpService';
import type { PasswordResetRequest, RawPasswordResetRequest } from '@/domain/passwordResetRequest';
import { endpoint } from 'src/basePath';

export type CreatePasswordResetResult = {
  maskedEmailAddress: string;
  expiryDate: Date;
};

type RawCreatePasswordResetResult = {
  maskedEmailAddress: string;
  /** string date */
  expiryDate: string;
};

export interface IPasswordResetRequestService {
  create: (username: string) => Observable<CreatePasswordResetResult>;
  get: (passwordResetId: number, code: string) => Observable<PasswordResetRequest>;
  use: (passwordResetId: number, code: string, password: string) => Observable<void>;
}

export class PasswordResetRequestService implements IPasswordResetRequestService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public create(username: string): Observable<CreatePasswordResetResult> {
    const url = this.getUrl();
    return this.http.post<RawCreatePasswordResetResult>(url, { username }).pipe(
      map(raw => ({
        ...raw,
        expiryDate: new Date(raw.expiryDate),
      })),
    );
  }

  public get(passwordResetId: number, code: string): Observable<PasswordResetRequest> {
    const url = `${this.getUrl()}/${passwordResetId}`;
    const params = { code };
    return this.http.get<RawPasswordResetRequest>(url, { params }).pipe(
      map(this.mapPasswordResetRequest),
    );
  }

  public use(passwordResetId: number, code: string, password: string): Observable<void> {
    const url = `${this.getUrl()}/${passwordResetId}`;
    return this.http.post(url, { code, password });
  }

  private getUrl(): string {
    return `${endpoint}/auth/password-resets`;
  }

  private readonly mapPasswordResetRequest = (raw: RawPasswordResetRequest): PasswordResetRequest => {
    return {
      ...raw,
      requestDate: new Date(raw.requestDate),
      expiryDate: raw.expiryDate === null ? null : new Date(raw.expiryDate),
    };
  };
}
