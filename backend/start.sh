#!/bin/sh

echo "Aplicando migrations Prisma..."
npx prisma migrate deploy

echo "Iniciando servidor..."
npm run dev
