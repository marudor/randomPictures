// @flow
import { createWriteStream, promises as fs } from 'fs';
import { resize } from 'easyimage';
import archiver from 'archiver';
import config from './config';
import crypto from 'crypto';
import path from 'path';
import RandomJs from 'random-js';

type Picture = {
  fileName: string,
  file: Buffer,
  type: string,
};

const random = new RandomJs(RandomJs.engines.browserCrypto);
const picturePath = config.picturePath;

fs.access(picturePath).catch((e: Error) => {
  throw new Error(`${picturePath} has to exist! ${e.toString()}`);
});

async function getAvailablePictures() {
  const rawavailablePictures = await fs.readdir(path.resolve(picturePath));
  const availablePictures = rawavailablePictures.filter(
    fileName => fileName.includes('.') && !fileName.endsWith('.zip')
  );

  return availablePictures;
}

export async function getPictureFileName() {
  const availablePictures = await getAvailablePictures();
  const index = random.integer(0, availablePictures.length - 1);

  return availablePictures[index];
}

export async function getSpecificPicture(fileName: string, thumb: boolean = false): Promise<Picture> {
  const splitted = fileName.split('.');
  const type = splitted[splitted.length - 1];
  const filePath = thumb ? `${picturePath}/thumb/${fileName}` : `${picturePath}/${fileName}`;

  try {
    return {
      fileName,
      file: await fs.readFile(path.resolve(filePath)),
      type,
    };
  } catch (e) {
    if (!thumb) {
      throw e;
    }
  }

  const image = await resize({
    src: path.resolve(`${picturePath}/${fileName}`),
    dst: path.resolve(`${picturePath}/thumb/${fileName}`),
    width: 400,
  });
  const file = await fs.readFile(path.resolve(image.path));

  return {
    fileName,
    file,
    type,
  };
}

export async function getRandomPicture(thumb: boolean = false) {
  const fileName = await getPictureFileName();

  return getSpecificPicture(fileName, thumb);
}

export async function getHash() {
  const availablePictures = await getAvailablePictures();
  const hashs = availablePictures
    .map(c =>
      crypto
        .createHash('sha256')
        .update(c)
        .digest('hex')
    )
    .join();

  return crypto
    .createHash('sha256')
    .update(hashs)
    .digest('hex');
}

export async function createZip(zipPath: string) {
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  archive.pipe(output);
  const p = new Promise((resolve, reject) => {
    output.on('end', () => {
      resolve();
    });
    archive.on('error', (err: Error) => {
      reject(err);
    });
  });
  const availablePictures = await getAvailablePictures();

  await Promise.all(
    availablePictures.map(async fileName => {
      archive.append(await fs.readFile(path.resolve(`${picturePath}/${fileName}`)), { name: fileName });
    })
  );
  archive.finalize();

  return p.then(() => fs.readFile(zipPath));
}

async function initZip() {
  const hash = await getHash();
  const zipPath = path.resolve(picturePath, `${hash}.zip`);

  try {
    await fs.access(zipPath);
  } catch (e) {
    await createZip(zipPath);
  }
}
initZip();

export async function getAll() {
  const hash = await getHash();
  const zipPath = path.resolve(picturePath, `${hash}.zip`);

  try {
    return fs.readFile(zipPath);
  } catch (e) {
    return null;
  }
}
