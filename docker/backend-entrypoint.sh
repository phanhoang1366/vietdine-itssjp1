#!/bin/sh
set -e

echo "Applying Prisma schema..."
./backend/node_modules/.bin/prisma db push --schema=backend/prisma/schema.prisma

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "Seeding database..."
  TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS","moduleResolution":"node"}' \
    node node_modules/ts-node-dev/node_modules/ts-node/dist/bin.js \
    --transpile-only backend/prisma/seed.ts
fi

echo "Starting backend..."
node backend/dist/index.js
