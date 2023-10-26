## declare base image - node 16
FROM node:16.4.2-alpine3.11 AS builder
## make work directory and copy files
WORKDIR /app
COPY . .
## project dependency install
RUN npm
RUN npm run build

FROM node:16.4.2-alpine3.11
WORKDIR /usr/src/app
COPY --from=builder /app ./

EXPOSE 3000
CMD npm run start