import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Video } from '@/domain/video';
import type { IHttpService } from '@/services/httpService';

export interface IVideoService {
  getVideo: (studentId: number, videoId: string) => Observable<Video>;
}

export class VideoService implements IVideoService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getVideo(studentId: number, videoId: string): Observable<Video> {
    const url = `${this.getUrl(studentId)}/${videoId}`;
    return this.httpService.get<Video>(url);
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}/videos`;
  }
}
