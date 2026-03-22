FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 80

CMD ["node", "scr/server.js"]