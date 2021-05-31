import { Schema } from 'jsonschema';

export const createBookmarkSchema: Schema = {
  id: '/createBookmarkRequest',
  type: 'object',
  properties: {
    url: {
      type: 'string',
      pattern:
        'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    },
  },
  required: ['url'],
};
