// @flow
import KoaRouter from 'koa-router';
import { getRandomCat, getRandomCatThumb } from './cats';

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
;

koa.use(router.routes());
