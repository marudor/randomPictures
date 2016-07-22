// @flow
import fs from 'fs';
import path from 'path';
import RandomJs from 'random-js';
import easyimage from 'easyimage';
import streams from 'memory-streams';

const random = new RandomJs(RandomJs.engines.browserCrypto);
const catPath = process.env.CAT_PATH || '';

async function getCatFileName() {
  // $FlowFixMe
  const rawAvailableCats: string[] = await fs.readdirAsync(path.resolve(catPath));
  const availableCats = rawAvailableCats.filter(fileName => fileName.includes('.'));
  const index = random.integer(0, availableCats.length - 1);
  return availableCats[index];
}

export async function getRandomCat() {
  const fileName = await getCatFileName();
  // $FlowFixMe
  const file: File = await fs.readFileAsync(path.resolve(`${catPath}/${fileName}`));
  return {
    fileName,
    file,
    type: file.type,
  };
}

export async function getRandomCatThumb() {
  const fileName = await getCatFileName();
  const writeStream = fs.createReadStream('myBinaryFile');
  const image = await easyimage.resize({
    src: path.resolve(`${catPath}/${fileName}`),
    dst: path.resolve(`${catPath}/thumb/${fileName}`),
    width: 400,
  });
  // $FlowFixMe
  const file: File = await fs.readFileAsync(path.resolve(image.path));
  return {
    fileName,
    file,
    type: file.type,
  };
}
