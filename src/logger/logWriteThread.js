const { parentPort } = require('node:worker_threads');
const axios = require('axios');
const { Timber } = require('@timberio/node');

const streams = [];

if (process.env.PRETTY_LOG) {
  const pinoPretty = require('pino-pretty');

  const prettyLog = pinoPretty.prettyFactory({
    colorize: true,
    translateTime: true,
  });
  streams.push((msg) => process.stdout.write(prettyLog(msg)));
} else {
  streams.push((msg) => console.log(msg));
}

parentPort.on('message', (msg) => {
  for (const s of streams) s(msg);
});
