import type { Observable } from 'rxjs';

import type { Video } from '@/domain/video';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface IVideoService {
  getVideo: (videoId: string) => Observable<Video>;
}

export class VideoService implements IVideoService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getVideo(videoId: string): Observable<Video> {
    const url = `${this.getUrl()}/${videoId}`;
    return this.httpService.get<Video>(url);
  }

  private getUrl(): string {
    return `${endpoint}/videos`;
  }
}
