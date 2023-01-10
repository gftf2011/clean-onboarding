FROM node:lts-alpine

LABEL maintainer="Gabriel Ferrari Tarall Ferraz"

WORKDIR /app

COPY . .

USER root

RUN npm i

CMD npm run start:dev