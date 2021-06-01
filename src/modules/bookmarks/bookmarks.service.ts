import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { from, iif, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import Errors from '../../@shared/enums/errors.enum';
import { OEmbedResponse } from '../../@shared/models/oembed.model';
import { Query } from '../../@shared/query';
import JsonSchemaService from '../../@shared/services/json-schema.service';
import OEmbedService from '../../@shared/services/oembed.service';
import Utils from '../../utils/utils';
import { createBookmarkSchema, updateBookmarkSchema } from './json-schemas/bookmarks.schema';
import { BookmarkModel } from './models/bookmark.model';
import { CreateBookmarkRequest, GetBookmarksQuery } from './models/bookmarks.dto';
import bookmarkQueries from './queries/bookmarks.queries';

@Injectable()
class BookmarksService extends Query {
  constructor(
    @Inject('BOOKMARKS_MODEL') private readonly bookmarksModel: Model<BookmarkModel>,
    private readonly oembedService: OEmbedService,
    private readonly jsonSchemaService: JsonSchemaService,
  ) {
    super();
    this.queryList.push(...bookmarkQueries);
  }

  createOne(body: CreateBookmarkRequest) {
    this.jsonSchemaService.validate(body, createBookmarkSchema);
    return this.oembedService.fetchFromUrl(body.url).pipe(
      map((oembedResponse) => ({
        oembedResponse,
        body,
      })),
      switchMap(this.createDocumentFromOEmbed.bind(this)),
    );
  }

  findMany(query: GetBookmarksQuery): Observable<{ results: BookmarkModel[]; count: number }> {
    return this.extractQuery(query, {
      count: true,
      sort: { createdAt: 1 },
    }).pipe(
      switchMap((extractedQueries) => {
        return from(this.bookmarksModel.aggregate([extractedQueries]).exec()).pipe(
          Utils.mapAggregateCount<BookmarkModel>(),
        );
      }),
    );
  }

  findOne(
    filter: FilterQuery<BookmarkModel>,
    throwOnNotFound: boolean,
  ): Observable<BookmarkModel & Document> {
    return from(this.bookmarksModel.findOne(filter)).pipe(
      catchError(() => {
        if (throwOnNotFound) {
          return throwError(
            new BadRequestException({
              message: 'Cannot find bookmark',
              code: Errors.E_CANNOT_FIND_DOCUMENT,
            }),
          );
        }
        return of(null);
      }),
    );
  }

  updateOne(id: string, toUpdate: CreateBookmarkRequest): Observable<BookmarkModel> {
    return of(this.jsonSchemaService.validate(toUpdate, updateBookmarkSchema)).pipe(
      switchMap(
        () => this.findOne({ _id: id }, true)),
        switchMap((bookmarkDocument) =>
          iif(
            () => !!toUpdate?.url,
            this.updateDocumentFromOEmbed(bookmarkDocument, toUpdate.url),
            of(bookmarkDocument),
          ),
        ),
        switchMap((bookmarkDocument: BookmarkModel & Document) =>
          iif(
            () => !!toUpdate?.tags,
            this.updateTags(bookmarkDocument, toUpdate.tags),
            of(bookmarkDocument),
          ),
        ),
        switchMap((bookmarkDocument: BookmarkModel & Document) => bookmarkDocument.save()),
        map((bookmarkDocument: BookmarkModel & Document) => bookmarkDocument.toObject()),
      );
  }

  deleteOne(id: string): Observable<BookmarkModel> {
    return from(this.findOne({ _id: id }, true)).pipe(
      switchMap((document) => {
        return document.remove();
      }),
    );
  }

  private createDocumentFromOEmbed(bookmark: {
    oembedResponse: OEmbedResponse;
    body: CreateBookmarkRequest;
  }): Observable<BookmarkModel> {
    const optionalItems = {};
    if (bookmark.oembedResponse.type === 'video') {
      optionalItems['duration'] = bookmark.oembedResponse.duration;
    }
    return from(
      this.bookmarksModel.create({
        type: bookmark.oembedResponse.type,
        author: bookmark.oembedResponse.author_name,
        title: bookmark.oembedResponse.title,
        tags: bookmark.body.tags,
        contentDetails: {
          width: bookmark.oembedResponse.width,
          height: bookmark.oembedResponse.height,
          ...optionalItems,
        },
      }),
    );
  }

  private updateDocumentFromOEmbed(
    bookmarkDocument: BookmarkModel & Document,
    url: string,
  ): Observable<BookmarkModel & Document> {
    return of(bookmarkDocument).pipe(
      switchMap(() => this.oembedService.fetchFromUrl(url)),
      map((oembedResponse) => {
        bookmarkDocument.type = oembedResponse.type;
        bookmarkDocument.author = oembedResponse.author_name;
        bookmarkDocument.title = oembedResponse.title;
        bookmarkDocument.contentDetails.width = oembedResponse.width;
        bookmarkDocument.contentDetails.height = oembedResponse.height;
        if (oembedResponse.type === 'video') {
          bookmarkDocument.contentDetails.duration = oembedResponse.duration;
        } else {
          bookmarkDocument.contentDetails.duration = undefined;
        }
        return bookmarkDocument;
      }),
    );
  }

  private updateTags(bookmarkDocument: BookmarkModel & Document, tags: string[]) {
    return of(bookmarkDocument).pipe(
      map((bookmark) => {
        bookmark.tags = tags;
        return bookmark;
      }),
    );
  }
}

export default BookmarksService;
