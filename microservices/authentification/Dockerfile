FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm i bcrypt

RUN npx tsc

EXPOSE 3001

CMD [ "npm", "start" ]


