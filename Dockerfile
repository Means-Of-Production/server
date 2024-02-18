# syntax=docker/dockerfile:1 
# open to using node:21-alpine as well

FROM node:21-bookworm
WORKDIR /usr/src/server

COPY . .

RUN npm clean-install

RUN npm run compile

EXPOSE 4000

USER node

CMD ["node", "dist/index.js"]
