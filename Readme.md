## ACCESS-CONTROL
Admin panel for fast access configuration within the system

### Startup requirements
* docker [How to install docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* docker-compose
* npm^5.7.0

### RUN DEV VERSION LOCALLY
1. `npm ci`
3. `npm run config:dev`
4. update `public/static/config.js`
5. see `TEMPLATER-UI LOCAL DEVELOPMENT` section
6. `npm run start:dev`
7. open `http://localhost:3000`
* [`npm ci` command description](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable)

### HOW TO RUN DEV / PROD VERSION IN DOCKER?
Guide on how to run this project in Docker described [HERE](https://github.com/propuskator/composer/blob/master/README.md)

### RUN PROD VERSION LOCALLY
1. `npm ci`
2. `npm run build`
3. `npm run config`
4. update `build/static/config.js`
5. serve static from `./build` dir (in ./etc/ you could find nginx.conf.sample)
6. open `http://localhost:3000` (or another host/port you have running at)
