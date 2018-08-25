// @flow
/* eslint camelcase: 0 */
import { getRandomCat } from './cats';
import { logger } from './logger';
import config from './config';
import Twit from 'twit';

const t = new Twit(config.twitter.auth);

const alt_text = { text: config.twitter.altText };

export default async function tweetImage() {
  try {
    const { fileName, file } = await getRandomCat();

    const b64Cat = file.toString('base64');
    const uploadedCat = await t.post('media/upload', { media_data: b64Cat });
    const mediaParams = {
      media_id: uploadedCat.data.media_id_string,
      alt_text,
    };

    await t.post('media/metadata/create', mediaParams);
    const tweet = await t.post('statuses/update', {
      status: config.twitter.tweetMessage,
      media_ids: [uploadedCat.data.media_id_string],
    });

    logger.info({
      status: config.twitter.tweetMessage,
      mediaIds: uploadedCat.data.media_id_string,
      image: fileName,
      tweet: tweet.data.id,
    });
  } catch (e) {
    logger.error(e);
  }
}
