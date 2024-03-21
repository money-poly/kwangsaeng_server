FROM node:16.4.2-alpine3.11

WORKDIR /api
COPY . .
RUN cd /api
RUN npm install
CMD npm run start
