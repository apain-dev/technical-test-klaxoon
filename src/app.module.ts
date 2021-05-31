import { Module } from '@nestjs/common';
import databaseProviders from './@shared/providers/database.providers';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {
}
