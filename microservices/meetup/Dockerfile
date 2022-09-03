FROM node

WORKDIR /app

COPY . ./

RUN npm install

RUN npx tsc

EXPOSE 3000

CMD [ "npm", "start" ]


