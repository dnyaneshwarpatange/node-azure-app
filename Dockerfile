FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# FIX 1: Add a space between the two dots
COPY . .

EXPOSE 3000

# FIX 2: Change "start" to "app.js"
CMD ["node", "app.js"]