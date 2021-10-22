import { exec } from 'child_process';
import { promises as fs } from 'fs';
import GiphyApi from 'giphy-api';

const giphy = GiphyApi(process.env.GIPHY_API);
const execPromise = (command: string) =>
  new Promise<{
    stdout: Buffer;
    stderr: Buffer;
  }>((resolve, reject) =>
    exec(
      command,
      {
        encoding: 'buffer',
      },
      (err, stdout: Buffer, stderr: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            stdout,
            stderr,
          });
        }
      }
    )
  );

const downloadImage = async (url: string, id: string) => {
  const prefix = 'giphy/';

  const interimName = `${prefix}${id}.gif`;

  await execPromise(`curl -o ${interimName} ${url}`);
  const { stdout } = await execPromise(`shasum -a 256 ${interimName} | awk '{print $1}'`);
  const hash = stdout.toString('utf8').trim();

  await fs.rename(interimName, `${prefix}${hash}.gif`);
};

giphy.search(
  {
    q: 'tiger',
    offset: 0,
    limit: 10,
    fmt: 'json',
  },
  (err: any, res: any) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return;
    }
    res.data.forEach((result: any) => {
      const url: string =
        (result.images.original.gif && result.images.original.gif.url) ||
        (result.images.original && result.images.original.url);
      const id: string = result.id;

      if (url) {
        void downloadImage(url, id);
      } else {
        // eslint-disable-next-line no-console
        console.warn(result);
      }
    });
  }
);
