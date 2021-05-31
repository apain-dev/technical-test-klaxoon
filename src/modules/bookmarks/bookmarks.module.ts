import { HttpModule, Module } from '@nestjs/common';
import DatabaseModule from '../../@shared/modules/database.module';
import JsonSchemaModule from '../../@shared/modules/json-schema.module';
import OEmbedService from '../../@shared/services/oembed.service';
import BookmarksController from './bookmarks.controller';
import bookmarksProviders from './bookmarks.providers';
import BookmarksService from './bookmarks.service';

@Module({
  imports: [DatabaseModule, HttpModule, JsonSchemaModule],
  controllers: [BookmarksController],
  providers: [...bookmarksProviders, BookmarksService, OEmbedService],
})
class BookmarksModule {}

export default BookmarksModule;
