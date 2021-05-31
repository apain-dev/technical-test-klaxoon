import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BookmarksService from './bookmarks.service';

@Controller('/bookmarks')
@ApiTags('Bookmarks controller')
class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('')
  createBookmark() {
    return this.bookmarksService.createOne();
  }
}

export default BookmarksController;
