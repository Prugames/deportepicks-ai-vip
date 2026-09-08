FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
