// @flow
import config from './config';
import http from 'http';
import Koa from 'koa';
import Routes from './controller';

const koa = new Koa();

koa.use(Routes.routes());

// koa.use(Bodyparser());

const server = http.createServer(koa.callback());

server.listen(config.webPort);
