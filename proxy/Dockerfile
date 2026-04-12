FROM node:20-alpine

WORKDIR /app

RUN npm init -y && npm install express axios

COPY server.js .

EXPOSE 3005

CMD ["node", "server.js"]
