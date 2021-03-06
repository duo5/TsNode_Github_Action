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
COPY ecosystem-staging.json /usr/src/app
COPY dist /usr/src/app/dist
COPY config /usr/src/app/config

EXPOSE 8085

CMD ["pm2-runtime", "start", "ecosystem-staging.json"]
