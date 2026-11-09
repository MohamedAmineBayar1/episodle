# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build \
 && npm prune --omit=dev \
 && npm cache clean --force

# ---------- Stage 2: runtime (no npm) ----------
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

# Patch OS packages and remove npm/npx/yarn/corepack (source of the 10 findings)
RUN apk upgrade --no-cache \
 && rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
           /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg \
 && addgroup -S app && adduser -S app -G app

# Copy the built app and production-only node_modules from the build stage
COPY --from=build --chown=app:app /app ./

USER app
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]