ARG NODE_VER

FROM node:${NODE_VER}

RUN apt-get update  && apt-get install -y tree

RUN npm install -g @vue/cli

RUN npm install -g ts-node

WORKDIR /home/node/app
