/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import axios from 'axios';

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

interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at: string;
  width: number;
  height: number;
  color: string;
  description?: string;
  alt_description?: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  categories: any[];
  likes: number;
  liked_by_user: boolean;
  current_user_collection: any[];
}

interface UnsplashResponse {
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  cover_photo: UnsplashPhoto;
  photos: UnsplashPhoto[];
}

async function getData(page: number): Promise<UnsplashResponse> {
  return (
    await axios.get<UnsplashResponse>('https://unsplash.com/napi/landing_pages/images/animals/fox', {
      params: {
        page,
        per_page: 30,
      },
    })
  ).data;
}

const folderWithDescription = 'foxes/';
const folderWithoutDescription = 'maybeFox/';

async function downloadAndSave(photos: UnsplashPhoto[]) {
  // eslint-disable-next-line unicorn/no-array-reduce
  await photos.reduce(
    (prevPromise, currentPhoto) =>
      prevPromise.then(async () => {
        const correctFolder = (currentPhoto.description || currentPhoto.alt_description)?.toLowerCase().includes('fox')
          ? folderWithDescription
          : folderWithoutDescription;
        const interimName = `${correctFolder}${currentPhoto.id}.jpg`;

        try {
          await fs.stat(interimName);
          console.log(interimName, 'exists, skipping');
        } catch {
          console.log(interimName, 'not existant, downloading');
          await execPromise(`curl -o ${interimName} ${currentPhoto.urls.raw}`);
        }
      }),
    Promise.resolve()
  );
}

async function scrape() {
  let page = 1;
  let singlePage = await getData(page);

  await downloadAndSave(singlePage.photos);
  while (singlePage.photos.length) {
    page += 1;
    singlePage = await getData(page);
    await downloadAndSave(singlePage.photos);
  }
}

void scrape();
