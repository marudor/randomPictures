// @flow
import { getAll, getCatFileName, getHash, getRandomCat, getSpecificCat } from './cats';
import config from './config';
import KoaRouter from 'koa-router';

const router = new KoaRouter();
const postUri = config.postUri;

router
  .get('/', async ctx => {
    const cat = await getRandomCat();

    ctx.body = cat.file;
    ctx.set('cat', cat.fileName);
    ctx.response.type = cat.type;
  })
  .get('/thumb', async ctx => {
    const cat = await getRandomCat(true);

    ctx.body = cat.file;
    ctx.set('cat', cat.fileName);
    ctx.response.type = cat.type;
  })
  .get('/specific', async ctx => {
    ctx.body = await getCatFileName();
  })
  .get('/specific/:id', async ctx => {
    const { id } = ctx.params;
    const cat = await getSpecificCat(id);

    ctx.body = cat.file;
    ctx.set('cat', cat.fileName);
    ctx.response.type = cat.type;
  })
  .get('/specific/:id/thumb', async ctx => {
    const { id } = ctx.params;
    const cat = await getSpecificCat(id, true);

    ctx.body = cat.file;
    ctx.set('cat', cat.fileName);
    ctx.response.type = cat.type;
  })
  .get('/hash', async ctx => {
    ctx.body = await getHash();
  })
  .get('/all.zip', async ctx => {
    ctx.body = await getAll();
    ctx.attachment('cats.zip');
    ctx.set('Content-type', 'application/zip');
  })
  .post(postUri, async ctx => {
    if (!config.twitter.disabled) {
      const tweetImage = require('./twitter').default;

      if (ctx.request.header.apikey !== config.apiToken) {
        ctx.status = 401;

        return;
      }
      await tweetImage();
    }
  });

export default router;
