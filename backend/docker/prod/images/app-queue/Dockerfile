FROM node:lts-alpine

LABEL maintainer="Gabriel Ferrari Tarall Ferraz"

WORKDIR /app

COPY ./backend .

RUN npm i --silent

CMD npm run start:queue:dev