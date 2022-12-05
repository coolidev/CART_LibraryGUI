FROM node:alpine

WORKDIR /usr/app

COPY . .
# RUN npm install -f
# RUN npm run build
WORKDIR ../testAPI
RUN npm install -f
RUN npm run babel


CMD ["npm", "start"]
