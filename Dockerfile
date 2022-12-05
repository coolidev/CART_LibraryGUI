FROM node:alpine

WORKDIR /usr/app

COPY . .
RUN npm install -f

CMD ["npm", "start"]
