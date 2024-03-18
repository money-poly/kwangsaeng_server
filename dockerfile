FROM node:16.4.2-alpine3.11

WORKDIR /api
COPY . .

# aws-cli setting
RUN cd /
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install --no-cache-dir \
        awscli \
    && rm -rf /var/cache/apk/*
RUN mkdir /root/.aws
COPY .aws /root/.aws

RUN cd /api
RUN npm install
RUN npm uninstall dynamoose nestjs-dynamoose
CMD npm run start

