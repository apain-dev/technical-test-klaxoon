import { Validator } from 'jsonschema';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OEmbedResponse } from '../../@shared/models/oembed.model';
import JsonSchemaService from '../../@shared/services/json-schema.service';
import BookmarksService from './bookmarks.service';
import { BookmarkContentDetailsModel, BookmarkModel } from './models/bookmark.model';

const mockedOembedService: any = {};
const mockedBookmarksModel: any = {};
mockedBookmarksModel.create = jest.fn((args) => of(args));
mockedBookmarksModel.aggregate = jest.fn(() => ({
  exec: () =>
    of([
      {
        paginatedResults: [{}],
        totalCount: [{ count: 1 }],
      },
    ]),
}));

class BookmarkDocument implements BookmarkModel {
  tags: string[] = [];

  author = {
    name: 'test',
    url: 'http://test',
  };

  contentDetails: BookmarkContentDetailsModel = {
    width: 200,
    height: 200,
  };

  title = 'test';

  webPage = '';

  contentUrl = 'https://live.staticflickr.com/3';

  thumbnail = {
    url: 'https://live.staticflickr.com/3123/2341623661_7c99f48bbf_q.jpg',
    width: 150,
    height: 150,
  };

  type: 'photo' | 'video' = 'photo';

  save() {
    return of(this);
  }

  toObject() {
    return {
      tags: this.tags,
      author: this.author,
      contentDetails: this.contentDetails,
      title: this.title,
      type: this.type,
      webPage: this.webPage,
      contentUrl: this.contentUrl,
      thumbnail: this.thumbnail,
    };
  }

  remove() {
    return of(this);
  }
}

mockedBookmarksModel.findOne = jest.fn(() => of(new BookmarkDocument()));

mockedOembedService.fetchFromUrl = jest.fn<Observable<OEmbedResponse>, [string]>(() => {
  return of({
    url: 'https://live.staticflickr.com/3',
    type: 'photo',
    width: 200,
    author_name: 'test',
    height: 200,
    author_url: 'http://test',
    title: 'test',
    provider_name: 'flickr',
    version: 'e',
    provider_url: 'https://flickr.com',
    thumbnail_url: 'https://live.staticflickr.com/3123/2341623661_7c99f48bbf_q.jpg',
    thumbnail_width: 150,
    thumbnail_height: 150,
  });
});

describe('Bookmarks service', () => {
  let bookmarksService: BookmarksService;
  beforeAll(() => {
    bookmarksService = new BookmarksService(
      mockedBookmarksModel,
      mockedOembedService,
      new JsonSchemaService(new Validator()),
    );
  });
  describe('Create one', () => {
    it('should create one document and return it', function (done) {
      bookmarksService.createOne({ url: 'https://flickr.com/test' }).subscribe((res) => {
        const toCompareResult = new BookmarkDocument();
        toCompareResult.webPage = 'https://flickr.com/test';
        expect(res).toStrictEqual(toCompareResult.toObject());
        done();
      });
    });
    it('should create one document with tags and return it', function (done) {
      bookmarksService
        .createOne({
          url: 'https://flickr.com/test',
          tags: ['test'],
        })
        .subscribe((res) => {
          const expected = new BookmarkDocument();
          expected.tags = ['test'];
          expected.webPage = 'https://flickr.com/test';
          expect(res).toStrictEqual(expected.toObject());
          done();
        });
    });
    it('should not create one document and throw an error due to url', function () {
      expect(() => bookmarksService.createOne({ url: '8' })).toThrow();
    });
    it('should not create one document and throw an error due to tags', function () {
      expect(() =>
        bookmarksService.createOne({
          url: 'https://flickr.com/test',
          // @ts-ignore
          tags: [8],
        }),
      ).toThrow();
    });
  });
  describe('Find many', () => {
    it('should find one document and properly return it', (done) => {
      bookmarksService.findMany({}).subscribe((result) => {
        expect(result).toStrictEqual({
          count: 1,
          results: [{}],
        });
        done();
      });
    });
  });
  describe('Find one', () => {
    it('should find document and return it', function (done) {
      bookmarksService.findOne({ _id: 'test' }, true).subscribe((result) => {
        expect(result.toObject()).toStrictEqual(new BookmarkDocument().toObject());
        done();
      });
    });
    it('should not find document and throw error', function (done) {
      mockedBookmarksModel.findOne.mockImplementationOnce(() => of(null));
      bookmarksService
        .findOne({ _id: 'test' }, true)
        .pipe(catchError(() => of(null)))
        .subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
    });
    it("should not find document and doesn't throw error", function (done) {
      mockedBookmarksModel.findOne.mockImplementationOnce(() => of(null));
      bookmarksService.findOne({ _id: 'test' }, false).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });
  describe('Update one', () => {
    it('should update document tags and return it', function (done) {
      bookmarksService.updateOne('test', { tags: ['test', 'test2'] }).subscribe((result) => {
        const toCompareResult = new BookmarkDocument();
        toCompareResult.tags = ['test', 'test2'];
        expect(result).toStrictEqual(toCompareResult.toObject());
        done();
      });
    });
    it('should update document from url and return it', function (done) {
      bookmarksService
        .updateOne('test', { url: 'https://flickr.com/22113305' })
        .subscribe((result) => {
          const toCompareResult = new BookmarkDocument();
          toCompareResult.webPage = 'https://flickr.com/22113305';
          toCompareResult.contentDetails = result.contentDetails;
          expect(result).toStrictEqual(toCompareResult.toObject());
          done();
        });
    });
    it('should not update and trow an error due to url', function () {
      expect(() => bookmarksService.updateOne('test', { url: 'a' })).toThrow();
    });
    it('should not update and trow an error due to tags', function () {
      expect(() =>
        bookmarksService.updateOne('test', {
          url: 'https://flickr.com/22113305',
          // @ts-ignore
          tags: [8],
        }),
      ).toThrow();
    });
  });
  describe('Delete one', () => {
    it('should remove document and return it', (done) => {
      bookmarksService.deleteOne('test').subscribe((result) => {
        expect(result.toObject()).toStrictEqual(new BookmarkDocument().toObject());
        done();
      });
    });
    it('should not remove document and throw error', (done) => {
      mockedBookmarksModel.findOne.mockImplementationOnce(() => throwError(null));
      bookmarksService
        .deleteOne('test')
        .pipe(catchError(() => of(null)))
        .subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
    });
  });
});
