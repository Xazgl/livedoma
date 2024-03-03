FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["./xmlTasks/package.json", "./xmlTasks/package-lock.json*", "./"]
ADD ./prisma/ ./prisma/
# RUN npm install --production --silent && mv node_modules ../
RUN npm ci --omit=dev
RUN npx prisma generate
RUN echo "while true; do foo; sleep 2; done" >> /bootstrap.sh
RUN chmod +x /bootstrap.sh
COPY ./xmlTasks .
# RUN chown -R node /usr/src/app
# USER node
# CMD ["node", "index.js"]
# Добавляет в конец файла crontab. Дату проверить можно на https://crontab.guru
# RUN echo "0 */6 * * * /usr/local/bin/node /usr/src/app/index.js" >> /etc/crontab
RUN echo "* * * * * /usr/local/bin/node /usr/src/app/index.js" >> /etc/crontab
CMD /bootstrap.sh
