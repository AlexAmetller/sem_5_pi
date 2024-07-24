FROM node:19-alpine

RUN apk upgrade

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

ENTRYPOINT [ "node", "./build/src/app.js" ]
