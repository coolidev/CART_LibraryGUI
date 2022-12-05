FROM node:alpine

WORKDIR /usr/app

COPY . .
RUN npm install -f
RUN npm run build
RUN cd ../front
RUN npm install -f
RUN npm run babel


CMD ["npm", "start"]
