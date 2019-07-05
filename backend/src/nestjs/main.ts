// tslint:disable: no-var-requires
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

import fs from 'fs';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { EntityNotFoundFilter } from './exception/entity-not-found.filter';
import { QueryFailedFilter } from './exception/query-failed.filter';

async function bootstrap() {
  const isDev = process.env.NODE_ENV && process.env.NODE_ENV !== 'prod';

  const app = isDev
    ? await NestFactory.create(AppModule)
    : await NestFactory.create(AppModule, {
        httpsOptions: {
          cert: fs.readFileSync('/home/ubuntu/certificates/cert.pem', 'utf8'),
          key: fs.readFileSync('/home/ubuntu/certificates/privkey.pem', 'utf8'),
        },
      });

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL });
  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(4000);
}
bootstrap();
