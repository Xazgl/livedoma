# multy stage dockerfile
FROM node:lts-alpine as node_modules_dev
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN npm ci

FROM node:lts-alpine as node_modules_prod
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:lts-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY next.config.js ./
COPY --from=node_modules_dev /app/node_modules ./node_modules

RUN npx prisma generate

COPY . .

ENV NODE_ENV=production

RUN npm run build

# RUN npx prisma migrate deploy

FROM node:lts-alpine 

WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=node_modules_prod /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY prisma ./prisma/
COPY next.config.js ./
COPY xmlTasks ./xmlTasks 
# COPY .env.prod .env
RUN npx prisma generate

ENV NODE_ENV=production
# RUN echo "* * * * * /usr/local/bin/node /app/xmlTasks/index.js" >> /etc/crontab
RUN (crontab -u $(whoami) -l; echo "* * * * * /usr/local/bin/node /app/xmlTasks/index.js" ) | crontab -u $(whoami) -

EXPOSE 3000