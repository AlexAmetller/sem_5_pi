FROM node:19-alpine as build-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.0-alpine
COPY --from=build-deps /app/dist /usr/share/nginx/html

COPY ./env.sh /docker-entrypoint.d/

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
