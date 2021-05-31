import { Module } from '@nestjs/common';
import DatabaseModule from '../../@shared/modules/database.module';
import BookmarksController from './bookmarks.controller';
import bookmarksProviders from './bookmarks.providers';
import BookmarksService from './bookmarks.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BookmarksController],
  providers: [...bookmarksProviders, BookmarksService],
})
class BookmarksModule {}

export default BookmarksModule;
