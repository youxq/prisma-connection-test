FROM node:20

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

COPY ./src ./src
COPY ./prisma ./prisma
COPY ./libquery_engine.so ./libquery_engine.so

RUN yarn install && yarn generate && yarn build

CMD ["node", "lib/index.js"]
