import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../../@shared/models/error.models';
import BookmarksService from './bookmarks.service';
import { BookmarkModel } from './models/bookmark.model';
import { CreateBookmarkRequest } from './models/bookmarks.dto';

@Controller('/bookmarks')
@ApiTags('Bookmarks controller')
class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('')
  @ApiCreatedResponse({type: BookmarkModel, description: 'Bookmark successfully created'})
  @ApiBadRequestResponse({type: BadRequestResponse, description: 'A bad request has occurred. Most of the time, it occurred because of bad data'})
  @ApiInternalServerErrorResponse({type: BadRequestResponse, description: 'An internal error has occurred'})
  createBookmark(@Body() body: CreateBookmarkRequest) {
    return this.bookmarksService.createOne(body);
  }
}

export default BookmarksController;
