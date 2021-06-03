FROM nginx:stable-alpine

WORKDIR /usr/src/api
RUN ls
COPY ./dist/ ./
RUN apk add npm

CMD ["node", "main.js"]

EXPOSE 80
