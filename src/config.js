// @flow
const config = {
  webPort: Number.parseInt(process.env.WEB_PORT || '4223', 10),
  imagePath: process.env.CAT_PATH || '',
  postUri: process.env.POST_URI || '/hourlycat',
  apiToken: process.env.API_TOKEN,
  twitter: {
    disabled: !process.env.ENABLE_TWITTER,
    auth: {
      consumer_key: process.env.CONSUMER_KEY || '',
      consumer_secret: process.env.CONSUMER_SECRET || '',
      access_token: process.env.ACCESS_KEY || '',
      access_token_secret: process.env.ACCESS_KEY_SECRET || '',
    },
    altText: process.env.ALT_TEXT || 'Image',
    tweetMessage: process.env.TWEET_MESSAGE,
  },
};

if (!config.imagePath) {
  throw new Error('CAT_PATH environment needed!');
}

export default config;
