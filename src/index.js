// @flow
import 'babel-polyfill';
import Koa from 'koa';
import Bodyparser from 'koa-bodyparser';
import http from 'http';
import fs from 'fs';
import Routes from './controller';

const koa = global.koa = new Koa();
koa.use(Routes.routes());

// koa.use(Bodyparser());

const server = global.server = http.createServer(global.koa.callback());


server.listen(process.env.WEB_PORT || 4223);
