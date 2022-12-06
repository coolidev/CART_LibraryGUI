FROM node:alpine

WORKDIR /usr/app

COPY . .
WORKDIR ./front
# RUN npm install -f
# RUN npm run build
# WORKDIR ../testAPI
# RUN npm install -f
RUN npm run babel


CMD npm run server
