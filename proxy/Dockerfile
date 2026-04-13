FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl \
    && npm init -y \
    && npm install express axios \
    && curl -sSfL https://varlock.dev/install.sh | sh -s -- --force-no-brew \
    && cp /root/.config/varlock/bin/varlock /usr/local/bin/varlock \
    && chmod 755 /usr/local/bin/varlock

COPY server.js .

EXPOSE 3005

CMD ["node", "server.js"]
