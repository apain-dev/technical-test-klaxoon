import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';

export class BookmarkContentDetailsModel {
  @ApiProperty({ description: 'Width of the media' })
  width: number;

  @ApiProperty({ description: 'Height of the media' })
  height: number;

  @ApiPropertyOptional({ description: 'Duration of the media (If type is video)' })
  duration?: number;
}

export class BookmarkContentAuthor {
  @ApiProperty({ description: 'Url to account of media\'s bookmark' })
  url: string;

  @ApiProperty({ description: 'Author\'s name' })
  name: string;
}

export class BookmarkContentThumbnail {
  @ApiProperty({ description: 'Url of the thumbnail' })
  url: string;

  @ApiProperty({ description: 'Width of the thumbnail' })
  width: number;

  @ApiProperty({ description: 'Height of the thumbnail' })
  height: number;
}

export class BookmarkModel {
  @ApiProperty({ description: 'Title of the bookmark' })
  title: string;

  @ApiProperty({
    type: String,
    enum: ['photo', 'video'],
    description: 'Type of the bookmark',
  })
  type: 'photo' | 'video';

  @ApiProperty({
    type: String,
    description: 'Url of the web page',
  })
  webPage: string;

  @ApiProperty({
    type: String,
    description: 'Url of the content. Can be direct link if type is photo or an iframeable link if type is video',
  })
  contentUrl: string;

  @ApiProperty({
    type: BookmarkContentThumbnail,
    description: 'thumbnail of the bookmark',
  })
  thumbnail: BookmarkContentThumbnail;

  @ApiProperty({
    description: 'Author of the bookmark',
    type: BookmarkContentAuthor,
  })
  author: BookmarkContentAuthor;

  @ApiProperty({ description: 'Tags of the bookmark' })
  tags: string[];

  @ApiProperty({ type: BookmarkContentDetailsModel })
  contentDetails: BookmarkContentDetailsModel;
}
