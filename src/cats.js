// @flow
import fs from 'fs-extra';
import path from 'path';
import RandomJs from 'random-js';
import easyimage from 'easyimage';

const random = new RandomJs(RandomJs.engines.browserCrypto);
const catPath = process.env.CAT_PATH || '';

async function getCatFileName() {
  const rawAvailableCats: string[] = await fs.readdir(path.resolve(catPath));
  const availableCats = rawAvailableCats.filter(fileName => fileName.includes('.'));
  const index = random.integer(0, availableCats.length - 1);
  return availableCats[index];
}

export async function getRandomCat() {
  const fileName = await getCatFileName();
  const splitted = fileName.split('.');
  const type = splitted[splitted.length - 1];

  const file: Buffer = await fs.readFile(path.resolve(`${catPath}/${fileName}`));
  return {
    fileName,
    file,
    type,
  };
}

export async function getRandomCatThumb() {
  const fileName = await getCatFileName();
  const image = await easyimage.resize({
    src: path.resolve(`${catPath}/${fileName}`),
    dst: path.resolve(`${catPath}/thumb/${fileName}`),
    width: 400,
  });
  const splitted = fileName.split('.');
  const type = splitted[splitted.length - 1];
  const file: Buffer = await fs.readFile(path.resolve(image.path));
  return {
    fileName,
    file,
    type,
  };
}
