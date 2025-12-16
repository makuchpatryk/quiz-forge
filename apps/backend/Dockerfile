FROM node:18-alpine as base
WORKDIR /app

# Dependencies stage
FROM base as deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base as development
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base as build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Production stage
FROM base as production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]