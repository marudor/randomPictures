// @flow
import bunyan, { INFO } from 'bunyan';
import bunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';

const accessConfig = {
  level: INFO,
  name: 'access',
  type: 'access',
  origin: process.env.ORIGIN,
  streams: [
    {
      stream: bunyanFormat({
        outputMode: 'short',
      }),
    },
  ],
  serializers: bunyan.stdSerializers,
};

const applicationConfig = {
  level: INFO,
  name: 'application',
  type: 'application',
  origin: process.env.ORIGIN,
  streams: [
    {
      stream: bunyanFormat({
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
    stream: new bunyanLoggly(logglyConfig),
    type: 'raw',
  });
  applicationConfig.streams.push({
    stream: new bunyanLoggly(logglyConfig),
    type: 'raw',
  });
}

export const accessLogger = bunyan.createLogger(accessConfig);
export const logger = bunyan.createLogger(applicationConfig);
export const middlewares = [bunyanMiddleware(accessLogger), bunyanMiddleware.requestLogger()];
