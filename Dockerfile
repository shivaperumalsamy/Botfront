FROM node:12.16.1 as botfront
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
EXPOSE 8080
RUN npm install http-server
CMD [ "npm", "run", "prod" ]
