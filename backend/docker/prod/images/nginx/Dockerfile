FROM nginxinc/nginx-unprivileged:1-alpine

LABEL maintainer="Gabriel Ferrari Tarall Ferraz"

COPY ./templates/prod/default.conf.tpl /etc/nginx/default.conf.tpl

ARG listen_port
ARG server_port
ARG server_app

ENV LISTEN_PORT ${listen_port}
ENV SERVER_PORT ${server_port}
ENV SERVER_APP ${server_app}

USER root

RUN touch /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx /etc/nginx/conf.d/default.conf
RUN envsubst < /etc/nginx/default.conf.tpl > /etc/nginx/conf.d/default.conf

USER nginx

CMD [ "nginx", "-g", "daemon off;" ]