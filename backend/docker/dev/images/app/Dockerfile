FROM node:16.16.0-alpine

LABEL maintainer="Gabriel Ferrari Tarall Ferraz"

WORKDIR /app

COPY . .

USER root

RUN npm i

CMD npm run start:dev