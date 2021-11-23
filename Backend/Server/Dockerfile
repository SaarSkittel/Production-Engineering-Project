FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm install express
RUN npm install mysql
CMD [ "node", "index.js" ]