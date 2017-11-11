// @flow
import { getAll, getHash, getRandomCat, getRandomCatThumb } from './cats';
import KoaRouter from 'koa-router';

const router = new KoaRouter();

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
  });

export default router;
