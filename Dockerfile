FROM node:alpine3.18

RUN mkdir /app

WORKDIR /app

COPY . .

RUN npm install

ENV pulsarUrl="pulsar://localhost:6650" \
    email="nnaattnnaaeell@gmail.com" \
    password="mvia dvlm gmum iqgu"

EXPOSE 4000

CMD [ "node", "app.js" ]