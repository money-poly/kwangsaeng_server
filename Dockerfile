# STEP 1
FROM node:16.4.2-alpine3.11 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# STEP 2
FROM node:16.4.2-alpine3.11
WORKDIR /usr/src/app
COPY --from=builder /app ./
ENV NODE_ENV dev
EXPOSE 3000
CMD npm run start:dev