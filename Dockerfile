FROM node:18-alpine

WORKDIR /usr/app

# Copy Files to container
COPY . .

# Enable SSH
RUN apk add --no-cache openssh

# Build Front-end
WORKDIR ./front
RUN npm install -f
RUN npm run build

# Build Backend
WORKDIR ../testAPI
RUN npm install -f
RUN npm run babel

# Launch Server on Docker startup
CMD npm run server