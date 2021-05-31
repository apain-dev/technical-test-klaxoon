import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BookmarkModel } from './models/bookmark.model';

@Injectable()
class BookmarksService {
  constructor(@Inject('BOOKMARKS_MODEL') private readonly bookmarksModel: Model<BookmarkModel>) {}

  createOne() {
    return null;
  }
}

export default BookmarksService;
