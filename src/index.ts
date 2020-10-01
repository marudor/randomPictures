import 'core-js/stable';
// import { loggerMiddleware } from './logger';
import config from './config';
import createAdmin from './admin';
import http from 'http';
import Koa from 'koa';
import Routes from './controller';
import userAgentOverride from './userAgentOverride';

const koa = new Koa();

koa.use(userAgentOverride);
// koa.use(loggerMiddleware);
koa.use(Routes.routes());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(koa.callback());

server.listen(config.webPort);

createAdmin();
