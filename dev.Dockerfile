FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p public/images && chmod 755 public/images
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "./bin/www"]