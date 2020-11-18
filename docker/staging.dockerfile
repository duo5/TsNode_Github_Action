# Base image
FROM node:latest

# Install pm2
RUN npm install pm2 -g

## Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependency
COPY package.json /usr/src/app
RUN npm install

# Copy file build to app directory
COPY ./dist /usr/src/app

EXPOSE 8080

CMD ["pm2", "start", "ecosystem-staging.json"]
