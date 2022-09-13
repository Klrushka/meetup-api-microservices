FROM node:16.17.0

WORKDIR /app

COPY . ./

RUN npm install

RUN npx tsc

EXPOSE 3000

CMD [ "npm", "start" ]


