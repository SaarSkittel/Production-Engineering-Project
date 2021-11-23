FROM node:13.12.0-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.0 -g --silent
RUN npm install react-router-dom@5.2.0
RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm install @mui/icons-material
COPY . .

CMD ["npm", "start"]