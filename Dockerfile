# multy stage dockerfile
FROM node:18-alpine as node_modules_dev
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN apk add --no-cache openssl
RUN --mount=type=cache,target=~/.npm npm ci --verbose

FROM node:18-alpine as node_modules_prod
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN apk add --no-cache openssl
RUN --mount=type=cache,target=~/.npm npm ci --omit=dev --verbose

FROM node:18-alpine AS builder

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

# RUN npm run build
RUN --mount=type=cache,target=/app/.next/cache --mount=type=cache,target=~/.npm npm run build

# RUN npx prisma migrate deploy

FROM node:18-alpine
# RUN imagemagick with format
RUN apk add --no-cache openssl
RUN apk add --update --no-cache imagemagick
RUN apk add --update --no-cache jpeg
RUN apk add --update --no-cache libwebp
# RUN curl
RUN apk add --update --no-cache curl

WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=node_modules_prod /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY prisma ./prisma/
COPY next.config.js ./

COPY xmlTasks ./xmlTasks 
COPY static ./static
RUN mkdir -p static/images
COPY skillspace ./skillspace 
COPY report ./report
COPY applications ./applications
COPY insurance ./insurance 
COPY inparse ./inparse
COPY statictwo ./statictwo
COPY worker ./worker
COPY smartagent ./smartagent

# COPY static ./static/crm


# COPY .env.prod .env
RUN npx prisma generate

ENV NODE_ENV=production
# RUN echo "* * * * * /usr/local/bin/node /app/xmlTasks/index.js" >> /etc/crontab
# RUN (crontab -u $(whoami) -l; echo "0 */10 * * * /usr/local/bin/node /app/xmlTasks/indexforDownloadResizeMobile.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */2 * * * /usr/local/bin/node /app/xmlTasks/indexforDownloadResize.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "*/80 * * * * /usr/local/bin/node /app/xmlTasks/index.js" ) | crontab -u $(whoami) -
# RUN (crontab -u $(whoami) -l; echo "0 */4 * * * /usr/local/bin/node /app/xmlTasks/indexforDownloadResize.js" ) | crontab -u $(whoami) -

RUN (crontab -u $(whoami) -l; echo "0 */7 * * * /usr/local/bin/node /app/skillspace/index.js" ) | crontab -u $(whoami) -

RUN (crontab -u $(whoami) -l; echo "0 */1 * * * /usr/local/bin/node /app/report/index.js" ) | crontab -u $(whoami) -


RUN (crontab -u $(whoami) -l; echo "0 */2 * * * /usr/local/bin/node /app/applications/index.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */3 * * * /usr/local/bin/node /app/applications/mango.js") | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */4 * * * /usr/local/bin/node /app/applications/mangoSansara.js") | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */5 * * * /usr/local/bin/node /app/applications/sendMangoSansaraUtmInCrm.js") | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */5 * * * /usr/local/bin/node /app/applications/sendMangoUtmInCrm.js") | crontab -u $(whoami) -


RUN (crontab -u $(whoami) -l; echo "0 */10 * * * /usr/local/bin/node /app/applications/updateSansara.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */9 * * * /usr/local/bin/node /app/applications/update.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */4 * * * /usr/local/bin/node /app/applications/indexSansara.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */4 * * * /usr/local/bin/node /app/applications/indexNovodvinskaya.js" ) | crontab -u $(whoami) -

RUN (crontab -u $(whoami) -l; echo "0 */6 * * * /usr/local/bin/node /app/applications/indexRansom.js" ) | crontab -u $(whoami) -

RUN (crontab -u $(whoami) -l; echo "0 */3 * * * /usr/local/bin/node /app/insurance/index.js" ) | crontab -u $(whoami) -

RUN (crontab -u $(whoami) -l; echo "*/90 * * * * /usr/local/bin/node /app/inparse/index.js" ) | crontab -u $(whoami) -
RUN (crontab -u $(whoami) -l; echo "0 */3 * * * /usr/local/bin/node /app/inparse/send.js" ) | crontab -u $(whoami) -

EXPOSE 3000