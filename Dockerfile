FROM --platform=$BUILDPLATFORM node:19-alpine as base
RUN mkdir -p /app
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable

FROM base as build
RUN pnpm i --frozen-lockfile
ENV NODE_ENV=production
COPY src  /app/src/
COPY .babelrc.js /app/
RUN pnpm build

FROM base as app
RUN pnpm i -P
RUN npx modclean -r -a '*.ts|*.tsx'
COPY --from=build /app/dist/ /app/dist/

FROM node:19-alpine
ENV NODE_ENV=production
RUN apk add --no-cache imagemagick
WORKDIR /app
COPY --from=app /app /app
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable && pnpm rb
USER node
CMD [ "node", "dist/index.js" ]
