FROM node:8

RUN npm install -g forever

WORKDIR /usr/src/app

CMD ["sh", "-c", "forever --minUptime 1000 --spinSleepTime 5000 -w index.js"]
