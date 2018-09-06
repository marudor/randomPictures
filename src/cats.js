// @flow
import { createWriteStream, promises as fs } from 'fs';
import { resize } from 'easyimage';
import archiver from 'archiver';
import config from './config';
import crypto from 'crypto';
import path from 'path';
import RandomJs from 'random-js';

const random = new RandomJs(RandomJs.engines.browserCrypto);
const catPath = config.imagePath;

fs.access(catPath).catch((e: Error) => {
  throw new Error(`${catPath} has to exist! ${e.toString()}`);
});

async function getAvailableCats() {
  const rawAvailableCats = await fs.readdir(path.resolve(catPath));
  const availableCats = rawAvailableCats.filter(fileName => fileName.includes('.') && !fileName.endsWith('.zip'));

  return availableCats;
}

export async function getCatFileName() {
  const availableCats = await getAvailableCats();
  const index = random.integer(0, availableCats.length - 1);

  return availableCats[index];
}

export async function getSpecificCat(fileName: string, thumb: boolean = false) {
  const splitted = fileName.split('.');
  const type = splitted[splitted.length - 1];
  const filePath = thumb ? `${catPath}/thumb/${fileName}` : `${catPath}/${fileName}`;

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
    src: path.resolve(`${catPath}/${fileName}`),
    dst: path.resolve(`${catPath}/thumb/${fileName}`),
    width: 400,
  });
  const file = await fs.readFile(path.resolve(image.path));

  return {
    fileName,
    file,
    type,
  };
}

export async function getRandomCat(thumb: boolean = false) {
  const fileName = await getCatFileName();

  return getSpecificCat(fileName, thumb);
}

export async function getHash() {
  const availableCats = await getAvailableCats();
  const hashs = availableCats
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
  const availableCats = await getAvailableCats();

  await Promise.all(
    availableCats.map(async fileName => {
      archive.append(await fs.readFile(path.resolve(`${catPath}/${fileName}`)), { name: fileName });
    })
  );
  archive.finalize();

  return p.then(() => fs.readFile(zipPath));
}

async function initZip() {
  const hash = await getHash();
  const zipPath = path.resolve(catPath, `${hash}.zip`);

  try {
    await fs.access(zipPath);
  } catch (e) {
    await createZip(zipPath);
  }
}
initZip();

export async function getAll() {
  const hash = await getHash();
  const zipPath = path.resolve(catPath, `${hash}.zip`);

  try {
    return fs.readFile(zipPath);
  } catch (e) {
    return null;
  }
}
