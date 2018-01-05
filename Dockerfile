FROM node:8-slim

RUN apt-get update
RUN apt-get install imagemagick -y

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json yarn.lock /usr/app/
RUN yarn --no-cache
COPY src/ /usr/app/src/
COPY .babelrc /usr/app/
ENV NODE_ENV=production
RUN yarn build
CMD ["yarn", "start"]