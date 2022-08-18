import { promises as fs } from 'node:fs';
import { nodeCrypto, Random } from 'random-js';
import { resize } from 'easyimage';
import config from './config';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

interface Picture {
  fileName: string;
  file: Buffer;
  type: string;
}

const random = new Random(nodeCrypto);
const picturePath = config.picturePath;
const tmpPathPromise = fs.mkdtemp(path.resolve(os.tmpdir(), 'randomPictures'));

fs.access(picturePath).catch((e: Error) => {
  throw new Error(`${picturePath} has to exist! ${e.toString()}`);
});

async function getAvailablePictures() {
  const rawavailablePictures = await fs.readdir(path.resolve(picturePath));
  const availablePictures = rawavailablePictures.filter(
    (fileName) => fileName.includes('.') && !fileName.endsWith('.zip')
  );

  return availablePictures;
}

export async function getPictureFileName(): Promise<string> {
  const availablePictures = await getAvailablePictures();
  const index = random.integer(0, availablePictures.length - 1);

  return availablePictures[index];
}

export async function getSpecificPicture(fileName: string, thumb = false): Promise<Picture> {
  const splitted = fileName.split('.');
  const type = splitted[splitted.length - 1];
  const tmpPath = await tmpPathPromise;
  const thumbPath = `${tmpPath}/thumb/${fileName}`;
  const fullPath = `${picturePath}/${fileName}`;
  const filePath = thumb ? thumbPath : fullPath;

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
    src: path.resolve(fullPath),
    dst: path.resolve(thumbPath),
    width: 400,
  });
  const file = await fs.readFile(path.resolve(image.path));

  return {
    fileName,
    file,
    type,
  };
}

export async function getRandomPicture(thumb = false): Promise<Picture> {
  const fileName = await getPictureFileName();

  return getSpecificPicture(fileName, thumb);
}

export async function getHash(): Promise<string> {
  const availablePictures = await getAvailablePictures();
  const hashs = availablePictures.map((c) => crypto.createHash('sha256').update(c).digest('hex')).join(',');

  return crypto.createHash('sha256').update(hashs).digest('hex');
}
