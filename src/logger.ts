import bunyan, { INFO } from 'bunyan';
import BunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';
import bunyanSumoLogic from 'bunyan-sumologic';

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
const sumoLogicConfig = {
  collector: process.env.SUMO_COLLECTOR,
  endpoint: 'https://endpoint1.collection.eu.sumologic.com/receiver/v1/http/',
};

if (process.env.NODE_ENV === 'production') {
  if (logglyConfig.token && logglyConfig.subdomain) {
    // eslint-disable-next-line no-console
    console.log('Using loggly to log');
    accessConfig.streams.push({
      // @ts-ignore
      stream: new bunyanLoggly(logglyConfig),
      // @ts-ignore
      type: 'raw',
    });
  } else if (sumoLogicConfig.collector) {
    // eslint-disable-next-line no-console
    console.log('Using sumo to log');
    accessConfig.streams.push({
      // @ts-ignore
      stream: new bunyanSumoLogic(sumoLogicConfig),
      // @ts-ignore
      type: 'raw',
    });
  }
}

const accessLogger = bunyan.createLogger(accessConfig);

// @ts-ignore
export default [bunyanMiddleware(accessLogger), bunyanMiddleware.requestLogger()];
