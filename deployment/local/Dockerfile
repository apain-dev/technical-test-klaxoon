FROM node:lts-slim

WORKDIR /usr/src/api

COPY ../.. .

RUN npm i

RUN npm run build

RUN npm prune --production

EXPOSE 8080

CMD node dist/main.js
