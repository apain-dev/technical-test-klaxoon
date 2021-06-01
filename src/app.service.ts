import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
class AppService implements OnApplicationShutdown {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: typeof mongoose) {}

  onApplicationShutdown(signal?: string): any {
    return this.db.disconnect();
  }
}

export default AppService;
