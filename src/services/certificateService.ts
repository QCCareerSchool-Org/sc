import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Certificate } from '@/domain/certificate';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface ICertificateService {
  getCertificate: (signature: string) => Observable<Certificate>;
}

export class CertificateService implements ICertificateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCertificate(signature: string): Observable<Certificate> {
    const url = `${endpoint}/certificates/${signature}`;
    return this.httpService.get<Certificate>(url).pipe(
      map(this.mapCertificate),
    );
  }

  private readonly mapCertificate = (certificate: Certificate): Certificate => {
    return {
      ...certificate,
      graduationDate: new Date(certificate.graduationDate),
    };
  };
}
