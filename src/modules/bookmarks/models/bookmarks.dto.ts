import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookmarkRequest {
  @ApiProperty({
    description: 'Url of the video/picture',
    example: 'http://www.flickr.com/photos/bees/2341623661/',
  })
  url: string;

  @ApiPropertyOptional()
  tags?: string[];
}
