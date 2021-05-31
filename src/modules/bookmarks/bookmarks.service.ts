import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OEmbedResponse } from '../../@shared/models/oembed.model';
import JsonSchemaService from '../../@shared/services/json-schema.service';
import OEmbedService from '../../@shared/services/oembed.service';
import { createBookmarkSchema } from './json-schemas/bookmarks.schema';
import { BookmarkModel } from './models/bookmark.model';
import { CreateBookmarkRequest } from './models/bookmarks.dto';

@Injectable()
class BookmarksService {
  constructor(
    @Inject('BOOKMARKS_MODEL') private readonly bookmarksModel: Model<BookmarkModel>,
    private readonly oembedService: OEmbedService,
    private readonly jsonSchemaService: JsonSchemaService,
  ) {}

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

  private createDocumentFromOEmbed(bookmark: {
    oembedResponse: OEmbedResponse;
    body: CreateBookmarkRequest;
  }) {
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
}

export default BookmarksService;
