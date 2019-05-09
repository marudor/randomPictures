import { promises as fs } from 'fs';
import { nodeCrypto, Random } from 'random-js';
import { resize } from 'easyimage';
import config from './config';
import crypto from 'crypto';
import path from 'path';

type Picture = {
  fileName: string;
  file: Buffer;
  type: string;
};

const random = new Random(nodeCrypto);
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
