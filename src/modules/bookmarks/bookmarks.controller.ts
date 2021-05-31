import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BookmarksService from './bookmarks.service';
import { CreateBookmarkRequest } from './models/bookmarks.dto';

@Controller('/bookmarks')
@ApiTags('Bookmarks controller')
class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {
  }

  @Post('')
  createBookmark(@Body() body: CreateBookmarkRequest) {
    return this.bookmarksService.createOne(body);
  }
}

export default BookmarksController;
