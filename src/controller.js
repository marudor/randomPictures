// @flow
import { getAll, getHash, getRandomCat, getRandomCatThumb } from './cats';
import KoaRouter from 'koa-router';

const router = new KoaRouter();
const postUri = process.env.POST_URI || '/hourlycat';

router
  .get('/', async ctx => {
    const cat = await getRandomCat();

    ctx.body = cat.file;
    ctx.set('cat', cat.fileName);
    ctx.response.type = cat.type;
  })
  .get('/thumb', async ctx => {
    const cat = await getRandomCatThumb();

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
    if (process.env.ENABLE_TWITTER) {
      const tweetImage = require('./twitter').default;

      if (ctx.request.header.apikey !== process.env.API_TOKEN) {
        ctx.status = 401;

        return;
      }
      await tweetImage();
    }
  });

export default router;
