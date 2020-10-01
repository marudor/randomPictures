import { getHash, getPictureFileName, getRandomPicture, getSpecificPicture } from './pictures';
import { tweetImage } from './twitter';
import config from './config';
import KoaRouter from '@koa/router';

const router = new KoaRouter();
const postUri = config.postUri;

router
  .get('/', async (ctx) => {
    const picture = await getRandomPicture();

    ctx.body = picture.file;
    ctx.set('cat', picture.fileName);
    ctx.response.type = picture.type;
  })
  .get('/thumb', async (ctx) => {
    const picture = await getRandomPicture(true);

    ctx.body = picture.file;
    ctx.set('cat', picture.fileName);
    ctx.response.type = picture.type;
  })
  .get('/specific', async (ctx) => {
    ctx.body = await getPictureFileName();
  })
  .get('/specific/:id', async (ctx) => {
    const { id } = ctx.params;
    const picture = await getSpecificPicture(id);

    ctx.body = picture.file;
    ctx.set('cat', picture.fileName);
    ctx.response.type = picture.type;
  })
  .get('/specific/:id/thumb', async (ctx) => {
    const { id } = ctx.params;
    const picture = await getSpecificPicture(id, true);

    ctx.body = picture.file;
    ctx.set('cat', picture.fileName);
    ctx.response.type = picture.type;
  })
  .get('/hash', async (ctx) => {
    ctx.body = await getHash();
  })
  .post(postUri, async (ctx) => {
    if (!config.twitter.disabled) {
      if (ctx.request.header.apikey !== config.apiToken) {
        ctx.status = 401;

        return;
      }
      await tweetImage();
    }
  });

export default router;
