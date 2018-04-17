/// <reference types="express" />
/// <reference types="node" />
import * as express from 'express';
import { PathParams, RequestHandlerParams } from 'express-serve-static-core';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import { Server as HttpsServer } from 'https';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { Options, Props } from './types';
export { PubSub, withFilter } from 'graphql-subscriptions';
export { Options };
export { GraphQLServerLambda } from './lambda';
export declare class GraphQLServer {
    express: express.Application;
    subscriptionServer: SubscriptionServer | null;
    options: Options;
    executableSchema: GraphQLSchema;
    context: any;
    private middlewares;
    constructor(props: Props);
    use(...handlers: RequestHandlerParams[]): this;
    use(path: PathParams, ...handlers: RequestHandlerParams[]): this;
    get(path: PathParams, ...handlers: RequestHandlerParams[]): this;
    post(path: PathParams, ...handlers: RequestHandlerParams[]): this;
    start(options: Options, callback?: ((options: Options) => void)): Promise<Server | HttpsServer>;
    start(callback?: ((options: Options) => void)): Promise<Server | HttpsServer>;
}
