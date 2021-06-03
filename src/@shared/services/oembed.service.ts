import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Errors from '../enums/errors.enum';
import { OEmbedResponse } from '../models/oembed.model';

interface OEmbedAdapter {
  oembedUrl: string;

  matcher: RegExp;

  name: string;

  resultMapper?: (response: OEmbedResponse) => OEmbedResponse;
}

@Injectable()
class OEmbedService {
  private readonly adapters: OEmbedAdapter[] = [
    {
      name: 'Flickr',
      oembedUrl: 'http://www.flickr.com/services/oembed/',
      matcher: new RegExp(/(flickr)/g),
    },
    {
      name: 'Vimeo',
      oembedUrl: 'https://vimeo.com/api/oembed.json',
      matcher: new RegExp(/(vimeo)/g),
      resultMapper: (response: OEmbedResponse) => ({
        ...response,
        url: `https://player.vimeo.com/video/${response.video_id}`,
      }),
    },
  ];

  constructor(private readonly httpService: HttpService) {}

  fetchFromUrl(url: string): Observable<OEmbedResponse> {
    const adapter = this.adapters.find((adapter) => url.search(adapter.matcher) > -1);
    if (!adapter) {
      throw new BadRequestException({
        message: `Cannot find corresponding oembed adapter for ${url}`,
        code: Errors.OEMBED_ADAPTER_NOT_FOUND,
      });
    }
    return this.httpService
      .get<OEmbedResponse>(`${adapter.oembedUrl}/`, {
        params: {
          format: 'json',
          url: url,
        },
      })
      .pipe(
        map((response) => response.data),
        map((response) => (adapter.resultMapper ? adapter.resultMapper(response) : response)),
        catchError(() => {
          return throwError(
            new BadRequestException({
              message: `Cannot fetch given url in ${adapter.name}`,
              code: Errors.OEMBED_URL_NOT_FOUND,
            }),
          );
        }),
      );
  }
}

export default OEmbedService;
