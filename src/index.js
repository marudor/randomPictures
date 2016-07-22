// @flow
import 'babel-polyfill';
import Koa from 'koa';
import Bodyparser from 'koa-bodyparser';
import Promise from 'bluebird';
import http from 'http';
import fs from 'fs';

// $FlowFixMe
Promise.promisifyAll(fs);

const koa = global.koa = new Koa();
require('./controller');

// koa.use(Bodyparser());

const server = global.server = http.createServer(global.koa.callback());


server.listen(process.env.WEB_PORT || 4223);
