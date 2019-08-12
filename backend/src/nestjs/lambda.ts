import { Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from 'aws-serverless-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { EntityNotFoundFilter } from './exception/entity-not-found.filter';
import { QueryFailedFilter } from './exception/query-failed.filter';

let cachedServer: Server;

function bootstrapServer(): Promise<Server> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  return NestFactory.create(AppModule, adapter)
    .then(app => app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL }))
    .then(app => app.init())
    .then(app => app.use(cookieParser()))
    .then(app => app.useGlobalFilters(new EntityNotFoundFilter()))
    .then(app => app.useGlobalFilters(new QueryFailedFilter()))
    .then(() => serverlessExpress.createServer(expressApp));
}

export const handler: Handler = (event: any, context: Context) => {
  if (event.source === 'serverless-plugin-warmup') {
    // tslint:disable-next-line:no-console
    console.log('WarmUp - Lambda is warm!');
    return;
  }
  // server should be bootstrap every time while developing in local
  // if not the changes are not effective
  if (!cachedServer || process.env.IS_OFFLINE) {
    bootstrapServer().then(server => {
      cachedServer = server;
      return serverlessExpress.proxy(server, event, context);
    });
  } else {
    return serverlessExpress.proxy(cachedServer, event, context);
  }
};
