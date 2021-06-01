import { Module } from '@nestjs/common';
import DatabaseModule from './@shared/modules/database.module';
import AppService from './app.service';
import BookmarksModule from './modules/bookmarks/bookmarks.module';

@Module({
  imports: [BookmarksModule, DatabaseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
