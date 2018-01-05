// @flow
/* eslint camelcase: 0 */
import { getRandomCat } from './cats';
import Twit from 'twit';

const t = new Twit({
  consumer_key: process.env.CONSUMER_KEY || '',
  consumer_secret: process.env.CONSUMER_SECRET || '',
  access_token: process.env.ACCESS_KEY || '',
  access_token_secret: process.env.ACCESS_KEY_SECRET || '',
});

const ALT_TEXT = process.env.ALT_TEXT || 'Image';
const alt_text = { text: ALT_TEXT };

export default async function tweetImage() {
  try {
    const { fileName, file } = await getRandomCat();

    const b64Cat = file.toString('utf-8');
    const uploadedCat = await t.post('media/upload', { media_data: b64Cat });
    const mediaParams = {
      media_id: uploadedCat.data.media_id_string,
      alt_text,
    };

    await t.post('media/metadata/create', mediaParams);
    const tweet = await t.post('statuses/update', {
      status: process.env.TWEET_MESSAGE,
      media_ids: [uploadedCat.data.media_id_string],
    });

    // eslint-disable-next-line
    console.log({
      status: process.env.TWEET_MESSAGE,
      mediaIds: uploadedCat.data.media_id_string,
      image: fileName,
      tweet: tweet.data.id,
    });
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }
}
