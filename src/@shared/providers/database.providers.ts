import { Logger, Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';

function loadConfig(): Record<
  'MONGO_ADDRESS' | 'MONGO_DATABASE' | 'MONGO_PASSWORD' | 'MONGO_PORT' | 'MONGO_USER',
  string
> {
  return {
    MONGO_ADDRESS: process.env.MONGO_ADDRESS || '127.0.0.1',
    MONGO_DATABASE: process.env.MONGO_DATABASE || '',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
    MONGO_PORT: process.env.MONGO_PORT || '27017',
    MONGO_USER: process.env.MONGO_USER || '',
  };
}

const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      Logger.debug('Attempting to connect mongoDb', 'MongoDb');
      let mongoUri;
      const mongoConfig = loadConfig();
      if (mongoConfig.MONGO_USER.length) {
        mongoUri =
          `mongodb://${mongoConfig.MONGO_USER}:${mongoConfig.MONGO_PASSWORD}@${mongoConfig.MONGO_ADDRESS}:` +
          `${mongoConfig.MONGO_PORT}/${mongoConfig.MONGO_DATABASE}?authSource=admin`;
      } else {
        mongoUri =
          `mongodb://${mongoConfig.MONGO_ADDRESS}:` +
          `${mongoConfig.MONGO_PORT}/${mongoConfig.MONGO_DATABASE}?authSource=admin`;
      }
      try {
        return mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      } catch (e) {
        Logger.error('Cannot connect to mongoDb', `${mongoUri} is not reachable`, 'MongoDb');
        throw e;
      }
    },
  },
];

export default databaseProviders;
