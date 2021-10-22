import * as uuid from 'uuid';
import onFinished from 'on-finished';
import util from 'util';
import type { Context, Next } from 'koa';
import type P from 'pino';

declare module 'koa' {
  interface BaseContext {
    log: P.Logger;
  }
  interface Request {
    reqId: string;
  }
}

const headerName = 'X-Request-Id';
const ctxProp = 'reqId';
const logField = 'req_id';

const levelFromStatus = (status: number) => {
  if (status >= 500) {
    return 'error';
  } else if (status >= 400) {
    return 'warn';
  }

  return 'info';
};

const formatRequestMessage = (ctx: Context) => util.format('<-- %s %s', ctx.request.method, ctx.request.originalUrl);

const formatResponseMessage = (ctx: Context, data: any) =>
  util.format('--> %s %s %d %sms', ctx.request.method, ctx.request.originalUrl, ctx.status, data.duration);

export default (logger: P.Logger) =>
  (ctx: Context, next: Next): Promise<void> => {
    ctx.log = logger;

    const reqId = ctx.request.get(headerName) || uuid.v4();

    ctx[ctxProp] = reqId;
    ctx.request[ctxProp] = reqId;

    ctx.log = ctx.log.child({
      [logField]: reqId,
    });

    ctx.log.info(
      {
        req: ctx.req,
      },
      formatRequestMessage(ctx)
    );

    const startTime = Date.now();
    let err: any;

    const onResponseFinished = () => {
      const responseData = {
        req: ctx.req,
        res: ctx.res,
        err: undefined,
        duration: Date.now() - startTime,
      };

      if (err) {
        responseData.err = err;
      }

      const level = levelFromStatus(ctx.status);

      ctx.log[level](responseData, formatResponseMessage(ctx, responseData));

      // @ts-expect-error ???
      ctx.log = null;
    };

    return next()
      .catch((e) => {
        err = e;
      })
      .then(() => {
        onFinished(ctx.response.res, onResponseFinished);

        if (err) throw err;
      });
  };
