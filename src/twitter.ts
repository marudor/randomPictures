/* eslint camelcase: 0 */
import { getRandomPicture } from './pictures';
import config from './config';
import Logger from 'bunyan';
import Twit from 'twit';

const t = new Twit(config.twitter.auth);

const alt_text = { text: config.twitter.altText };

export default async function tweetImage(logger: Logger) {
  try {
    const { fileName, file } = await getRandomPicture();

    const b64Picture = file.toString('base64');
    const uploadedPicture = await t.post('media/upload', {
      stringify_ids: true,
      media_data: b64Picture,
    });
    const mediaParams = {
      stringify_ids: true,
      // @ts-ignore
      media_id: uploadedPicture.data.media_id_string,
      alt_text,
    };

    await t.post('media/metadata/create', mediaParams);
    const tweet = await t.post('statuses/update', {
      stringify_ids: true,
      status: config.twitter.tweetMessage,
      // @ts-ignore
      media_ids: [uploadedPicture.data.media_id_string],
    });

    logger.info({
      status: config.twitter.tweetMessage,
      // @ts-ignore
      mediaIds: uploadedPicture.data.media_id_string,
      image: fileName,
      // @ts-ignore
      tweet: tweet.data.id_str,
    });
  } catch (e) {
    logger.error(e);
  }
}
