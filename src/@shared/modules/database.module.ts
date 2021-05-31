import { Module } from '@nestjs/common';
import databaseProviders from '../providers/database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
class DatabaseModule {}

export default DatabaseModule;
