import {
  matchField,
  Stage
} from '../../../@shared/query';

const bookmarkQueries: Stage[] = [
  {
    matcher: ['title'],
    handler: (key, value) => {
      return matchField({ title: new RegExp('^(' + value + ')', 'i') });
    },
    priority: 3,
  },
  {
    matcher: ['type'],
    handler: (key, value) => {
      return matchField({ type: value });
    },
    priority: 2,
  },
  {
    matcher: ['tags'],
    handler: (key, value: string[]) => {
      return matchField({ tags: { $in: ['$tags', value] } });
    },
    priority: 1,
  },
];

export default bookmarkQueries;
