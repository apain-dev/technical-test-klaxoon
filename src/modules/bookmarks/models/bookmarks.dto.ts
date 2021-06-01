import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultQuery } from '../../../@shared/query';
import { BookmarkModel } from './bookmark.model';

export class CreateBookmarkRequest {
  @ApiProperty({
    description: 'Url of the video/picture',
    example: 'http://www.flickr.com/photos/bees/2341623661/',
  })
  url: string;

  @ApiPropertyOptional()
  tags?: string[];
}

export class GetBookmarksQuery extends DefaultQuery {
  @ApiPropertyOptional({ description: 'List of tags to find' })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Name to search' })
  name?: string;
}

export class GetBookmarksResponse {
  @ApiProperty({ description: 'Number of documents' })
  count: number;

  @ApiProperty({
    type: [BookmarkModel],
    description: 'List of bookmarks found',
  })
  results: BookmarkModel[];
}
