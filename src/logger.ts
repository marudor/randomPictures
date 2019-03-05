import bunyan, { INFO } from 'bunyan';
import BunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';

const accessConfig = {
  level: INFO,
  name: 'pictures',
  origin: process.env.ORIGIN,
  streams: [
    {
      stream: new BunyanFormat({
        outputMode: 'short',
      }),
    },
  ],
  serializers: bunyan.stdSerializers,
};

const logglyConfig = {
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN,
};

if (process.env.NODE_ENV === 'production' && logglyConfig.token && logglyConfig.subdomain) {
  // eslint-disable-next-line no-console
  console.log('Using loggly to log');
  accessConfig.streams.push({
    // @ts-ignore
    stream: new bunyanLoggly(logglyConfig),
    // @ts-ignore
    type: 'raw',
  });
}

const accessLogger = bunyan.createLogger(accessConfig);

// @ts-ignore
export default [bunyanMiddleware(accessLogger), bunyanMiddleware.requestLogger()];
