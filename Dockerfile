FROM ghcr.io/gethomepage/homepage:v1.12.3

# Install Varlock via the official script
RUN apk add --no-cache curl \
    && curl -sSfL https://varlock.dev/install.sh | sh -s -- --force-no-brew \
    && cp /root/.config/varlock/bin/varlock /usr/local/bin/varlock \
    && chmod 755 /usr/local/bin/varlock
