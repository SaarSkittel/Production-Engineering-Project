FROM node:alpine
WORKDIR /home/node/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
RUN npm install express
RUN npm install mysql
RUN npm install cors --save
CMD [ "node", "index.js" ]