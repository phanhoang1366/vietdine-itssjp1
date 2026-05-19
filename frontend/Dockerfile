FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci
RUN npm install lightningcss-linux-x64-musl@1.32.0 @tailwindcss/oxide-linux-x64-musl@4.3.0 --no-save

FROM deps AS builder

WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG SERVER_API_URL=http://backend:3001
ARG INTERNAL_API_URL=http://backend:3001
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV SERVER_API_URL=$SERVER_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

COPY frontend ./frontend
RUN npm run build --workspace frontend

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.ts ./frontend/next.config.ts

WORKDIR /app/frontend
EXPOSE 3000

CMD ["npm", "run", "start"]
