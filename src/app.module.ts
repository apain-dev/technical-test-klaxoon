import { Module } from '@nestjs/common';
import BookmarksModule from './modules/bookmarks/bookmarks.module';

@Module({
  imports: [BookmarksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
