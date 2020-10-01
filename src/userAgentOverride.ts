import request from 'request';
import type { Context, Next } from 'koa';

let override: {
  [userAgent: string]: string;
};

if (process.env.OVERRIDE) {
  const overrides = process.env.OVERRIDE.split(';');

  overrides.forEach((overridePair) => {
    const [userAgent, newBaseUrl] = overridePair.split('=');

    if (userAgent && newBaseUrl) {
      override = override || {};
      override[userAgent] = newBaseUrl;
    }
  });
}

export default (ctx: Context, next: Next): Promise<any> => {
  if (override) {
    const redirectBaseUrl = override[ctx.header['user-agent']];

    if (!redirectBaseUrl) return next();
    const options = {
      baseUrl: redirectBaseUrl,
      url: ctx.path,
      qs: ctx.query,
      headers: ctx.headers,
    };

    delete options.headers.host;

    return new Promise((resolve, reject) => {
      request(options).on('error', reject).pipe(ctx.res).on('end', resolve);
    });
  }

  return next();
};
