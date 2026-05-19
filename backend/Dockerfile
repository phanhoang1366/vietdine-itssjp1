FROM node:20-alpine AS deps

WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci

FROM deps AS builder

WORKDIR /app
COPY backend ./backend
RUN ./backend/node_modules/.bin/prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build --workspace backend

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY docker/backend-entrypoint.sh /usr/local/bin/backend-entrypoint.sh

RUN chmod +x /usr/local/bin/backend-entrypoint.sh

EXPOSE 3001

CMD ["backend-entrypoint.sh"]
