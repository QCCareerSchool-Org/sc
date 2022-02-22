import type { Observable } from 'rxjs';

import { endpoint } from '../basePath';
import { IHttpService } from './httpService';
import { AuthenticationPayload } from '@/domain/authenticationPayload';

export interface ILoginService {
  logIn: (username: string, password: string, stayLoggedIn: boolean) => Observable<AuthenticationPayload>;
  logOut: () => Observable<void>;
}

export class LoginService implements ILoginService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public logIn(username: string, password: string, stayLoggedIn: boolean): Observable<AuthenticationPayload> {
    const url = this.getUrl() + '/login';
    const body = { username, password, stayLoggedIn };
    return this.httpService.post<AuthenticationPayload>(url, body);
  }

  public logOut(): Observable<void> {
    const url = this.getUrl() + '/logout';
    return this.httpService.post<void>(url);
  }

  private getUrl(): string {
    return `${endpoint}/auth`;
  }
}
