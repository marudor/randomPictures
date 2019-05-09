import { promises as fs } from 'fs';
import config from '../config';
import Twit from 'twit';

const t = new Twit(config.twitter.auth);

async function getFollowerIds(userName: string, cursor?: string): Promise<any> {
  const ids = [];

  const r: any = await t.get('followers/ids', {
    screen_name: userName,
    cursor,
  });

  ids.push(...r.data.ids);
  // console.log(r.data);
  if (r.data.next_cursor_str) {
    const nextPageIds = await getFollowerIds(userName, r.data.next_cursor_str);

    ids.push(...nextPageIds);
  }

  return ids;
}

// getFolliwerIds('hourlyFox');

Promise.all(
  ['hourlyFox', 'hourlyCats', 'hourlyPinguins', 'hourlyTiger', 'hourlyPanda'].map(async name => {
    let follower;

    if (name === 'hourlyFox') {
      follower = await getFollowerIds(name);
    } else {
      follower = JSON.parse(await fs.readFile(`./${name}.json`, 'utf8'));
    }

    await fs.writeFile(`./${name}.json`, JSON.stringify(follower, undefined, 2));

    return follower;
  })
).then(async ids => {
  const allIds = ids.reduce((agg, ids) => [...agg, ...ids], []);

  await fs.writeFile('./all.json', JSON.stringify(allIds, undefined, 2));
  const uniqueIds = new Set(allIds);

  await fs.writeFile('./allUnique.json', JSON.stringify(uniqueIds, undefined, 2));
});
