FROM node:latest

RUN mkdir -p /usr/src/ykat
COPY package.json /usr/src/ykat/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
COPY . /usr/src/ykat
RUN cd /usr/src/ykat; cnpm install

EXPOSE 8081

RUN cnpm install pm2 -g --registry=https://registry.npm.taobao.org

ENV NODE_ENV dev

CMD ["pm2", "start", "/usr/src/ykat/server.js", "--name", "ykat", "--no-daemon"]
