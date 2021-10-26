FROM node:alpine
ENV NODE_ENV=production

WORKDIR /app
COPY . .
RUN yarn
RUN npm run build

EXPOSE 3000
CMD ["node", "server.js"]
