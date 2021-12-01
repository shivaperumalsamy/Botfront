FROM node:12.16.1-alpine

WORKDIR /app

COPY package.json .

COPY lib/index.js /app/lib/index.js

COPY lib/index.html /app/lib/index.html

RUN npm install http-server