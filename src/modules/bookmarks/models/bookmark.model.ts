import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookmarkContentDetailsModel {
  @ApiProperty({ description: 'Width of the media' })
  width: number;

  @ApiProperty({ description: 'Height of the media' })
  height: number;

  @ApiPropertyOptional({ description: 'Duration of the media (If type is video)' })
  duration: number;
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

  @ApiProperty({ description: 'Author of the bookmark' })
  author: string;

  @ApiProperty({description: 'Tags of the bookmark'})
  tags: string[];

  @ApiProperty({ type: BookmarkContentDetailsModel })
  contentDetails: BookmarkContentDetailsModel;
}
