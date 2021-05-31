import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import bookmarkSchema from './schema/bookmark.schema';

const bookmarksProviders: Provider[] = [
  {
    provide: 'BOOKMARKS_MODEL',
    useFactory: (connection: Connection) => connection.model('bookmarks', bookmarkSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

export default bookmarksProviders;
