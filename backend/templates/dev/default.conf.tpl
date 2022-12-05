server {
    listen ${LISTEN_PORT};

    location /sign-up {
        proxy_pass http://${SERVER_APP}:${SERVER_PORT}/api/V1/sign-up;
    }

    location /sign-in {
        proxy_pass http://${SERVER_APP}:${SERVER_PORT}/api/V1/sign-in;
    }
}