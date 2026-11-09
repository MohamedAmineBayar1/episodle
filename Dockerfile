FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev && npm cache clean --force
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["npm", "start"]