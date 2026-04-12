FROM ghcr.io/gethomepage/homepage:latest

# Install Varlock via the official script
RUN apk add --no-cache curl \
    && curl -sSfL https://varlock.dev/install.sh | sh -s -- --force-no-brew \
    && ln -s /root/.varlock/bin/varlock /usr/local/bin/varlock
