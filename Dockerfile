#  Dockerfile for Node Express Backend

FROM node:22-alpine3.20

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Exports
EXPOSE 3001

CMD ["npm","start"]