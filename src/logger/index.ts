import { SHARE_ENV, Worker } from 'node:worker_threads';
import cookie from 'cookie';
import koaLogger from './koaLogger';
import path from 'node:path';
import pino from 'pino';
import serializers from 'pino-std-serializers';

const writeWorker = new Worker(path.resolve(__dirname, 'logWriteThread.js'), {
  env: SHARE_ENV,
});

const writeOptions = {
  write(msg: string) {
    writeWorker.postMessage(msg);
  },
};

if (process.env.NODE_ENV === 'test') {
  writeWorker.unref();
}

export const logger = pino(
  {
    redact: {
      paths: ['req.remoteAddress', 'req.remotePort', 'res.statusCode'],
      remove: true,
    },
    name: process.env.ORIGIN || 'randomPictures',
    serializers: {
      req: serializers.wrapRequestSerializer((req) => {
        try {
          const cookies = cookie.parse(req.headers.cookie);

          req.headers = {
            // @ts-expect-error untyped
            cookie: cookies,
            'user-agent': req.headers['user-agent'],
            referer: req.headers.referer,
          };
        } catch {
          // if we can't parse cookies keep them
        }

        return req;
      }),
      res: serializers.res,
      err: serializers.err,
    },
  },
  writeOptions
);

export const loggerMiddleware = koaLogger(logger);
