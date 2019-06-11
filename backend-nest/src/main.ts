import * as dotenv from 'dotenv-safe';
dotenv.config({ path: __dirname + '/.env' });

import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { EntityNotFoundFilter } from './exception/entity-not-found.filter';
import { QueryFailedFilter } from './exception/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL });
  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(4000);
}
bootstrap();
