import Client from 'prom-client';
import Koa from 'koa';

export default (adminPort = 9000): void => {
  Client.collectDefaultMetrics();
  const koa = new Koa();

  koa.use((ctx) => {
    switch (ctx.request.url) {
      case '/metrics':
        ctx.body = Client.register.metrics();
        break;
      case '/ping':
        ctx.body = 'pong';
        break;
      default:
        break;
    }
  });

  koa.listen(adminPort);
};
