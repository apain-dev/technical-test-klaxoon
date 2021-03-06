import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import { readFile } from 'fs/promises';
import * as helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import environmentHandler from './environement';

async function getPackageVersion(): Promise<string> {
  const packagePath = join(__dirname, '..', 'package.json');
  try {
    const packageContent = await readFile(packagePath);
    return JSON.parse(packageContent.toString()).version;
  } catch (e) {
    Logger.error(`Cannot read package.json under path ${packagePath}`, e);
    process.exit(1);
  }
}

async function initSwagger(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('Klaxoon test')
    .setDescription('API du projet klaxoon test.')
    .setVersion(await getPackageVersion())
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs/', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(cors({}));

  await initSwagger(app);
  app.enableShutdownHooks();
  await app.listen(environmentHandler.environment.PORT);
  Logger.debug(`API listening on ${environmentHandler.environment.PORT}`);
}

bootstrap();
