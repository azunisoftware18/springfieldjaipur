FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma Client Generate
RUN npx prisma generate

EXPOSE 5600

CMD ["npm", "start"]
