import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
    return this.oembedService
      .fetchFromUrl(body.url)
      .pipe(switchMap(this.createDocumentFromOEmbed.bind(this)));
  }

  createDocumentFromOEmbed(oembedResponse: OEmbedResponse) {
    const optionalItems = {};
    if (oembedResponse.type === 'video') {
      optionalItems['duration'] = oembedResponse.duration;
    }
    return from(
      this.bookmarksModel.create({
        type: oembedResponse.type,
        author: oembedResponse.author_name,
        title: oembedResponse.title,
        contentDetails: {
          width: oembedResponse.width,
          height: oembedResponse.height,
          ...optionalItems,
        },
      }),
    );
  }
}

export default BookmarksService;
