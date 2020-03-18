FROM node:13-alpine

RUN apk add --update-cache imagemagick

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json yarn.lock /usr/app/
ENV NODE_ENV=production
RUN yarn --prod
COPY dist/ /usr/app
CMD ["node", "index.js"]
