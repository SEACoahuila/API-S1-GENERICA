FROM node:18-alpine

WORKDIR /home/node
USER node

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install

COPY src ./src

EXPOSE 4000

CMD [ "yarn","debug" ]
