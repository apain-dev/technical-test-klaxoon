import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import OEmbedService from './oembed.service';

const mockedHttp: any = jest.fn();
mockedHttp.get = jest.fn(() => of({ data: {} }));

describe('Oembed service', () => {
  let oembedService: OEmbedService;
  beforeAll(async () => {
    oembedService = new OEmbedService(mockedHttp);
  });
  it('should fetch url for flickr', function (done) {
    oembedService.fetchFromUrl('https://flickr.com/test').subscribe((result) => {
      expect(result).toStrictEqual({});
      done();
    });
  });
  it('should fetch url for vimeo', function (done) {
    oembedService.fetchFromUrl('https://vimeo.com/test').subscribe((result) => {
      expect(result).toStrictEqual({ url: 'https://player.vimeo.com/video/undefined' });
      done();
    });
  });
  it('should not find adapter and throw error', function () {
    expect(() => oembedService.fetchFromUrl('https://test.com/test')).toThrow();
  });

  it('should failed fetching url and throw error', function (done) {
    mockedHttp.get.mockImplementationOnce(() => throwError('err'));
    oembedService
      .fetchFromUrl('https://flickr.com/test')
      .pipe(
        catchError(() => {
          return of(null);
        }),
      )
      .subscribe((result) => {
        expect(result).toBe(null);
        done();
      });
  });
});
