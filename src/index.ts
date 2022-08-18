import 'core-js/stable';
import { loggerMiddleware } from './logger';
import config from './config';
import createAdmin from './admin';
import http from 'node:http';
import Koa from 'koa';
import Routes from './controller';

const koa = new Koa();

koa.use(loggerMiddleware);
koa.use(Routes.routes());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(koa.callback());

console.log(config);
server.listen(config.webPort);

console.log('Server started');

createAdmin();

console.log('Admin server started');
