FROM nginxinc/nginx-unprivileged:1-alpine

LABEL maintainer="Gabriel Ferrari Tarall Ferraz"

COPY ./templates/dev/default.conf.tpl /etc/nginx/default.conf.tpl

ENV LISTEN_PORT 8000
ENV SERVER_APP app
ENV SERVER_PORT 3000

USER root

RUN touch /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx /etc/nginx/conf.d/default.conf
RUN envsubst < /etc/nginx/default.conf.tpl > /etc/nginx/conf.d/default.conf

USER nginx

CMD [ "nginx", "-g", "daemon off;" ]