FROM node:12-alpine as BUILDER

WORKDIR /admin

RUN apk add git

COPY bin bin
COPY public public
COPY src src
COPY etc etc
COPY package*.json ./
COPY *.js ./
COPY jsconfig.json ./
COPY .stylelintrc ./

RUN npm ci
RUN npm run build


FROM nginx:alpine

WORKDIR /admin

COPY etc/nginx.conf.sample /etc/nginx/conf.d/default.conf
COPY ./bin/create_conf.sh .
COPY --from=BUILDER /admin/build /admin/build

CMD /bin/sh ./create_conf.sh && exec /usr/sbin/nginx -g 'daemon off;'
