// tslint:disable: no-var-requires
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { EntityNotFoundFilter } from './exception/entity-not-found.filter';
import { QueryFailedFilter } from './exception/query-failed.filter';

async function bootstrap() {
  // tslint:disable-next-line: no-console
  console.log('Main.ts1');

  const app = await NestFactory.create(AppModule);

  // tslint:disable-next-line: no-console
  console.log('Main.ts2');

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL });
  app.use(cookieParser());
  // tslint:disable-next-line: no-console
  console.log('Main.ts3');

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(4000);
}
bootstrap();
