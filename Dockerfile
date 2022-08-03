FROM node:16
WORKDIR /app
RUN npm install -g typescript ts-node
COPY package.json package-lock.json ./
RUN npm ci
ADD . . 
# RUN npm run build
# CMD [ "node", "dist/server.js" ] 
#CMD [ "node", "nodemon src/server.ts" ]
RUN chmod +x ./commands.sh
ENTRYPOINT [ "./commands.sh" ]