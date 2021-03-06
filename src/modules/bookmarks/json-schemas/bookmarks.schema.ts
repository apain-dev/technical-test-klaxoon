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
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['url'],
};

export const updateBookmarkSchema: Schema = {
  id: '/updateBookmarkRequest',
  type: 'object',
  properties: {
    url: {
      type: 'string',
      pattern:
        'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [],
};
