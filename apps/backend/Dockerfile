FROM node:20 AS builder
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY domain/package.json ./domain/

RUN npm install

COPY apps/backend ./apps/backend
COPY domain ./domain

RUN npm run build --workspace=domain

RUN npm run build --workspace=apps/backend

FROM node:20-slim
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

COPY --from=builder /usr/src/app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /usr/src/app/domain/dist ./domain/dist

RUN mkdir -p /usr/src/app/apps/backend/node_modules/@domain && \
    ln -s /usr/src/app/domain/dist /usr/src/app/apps/backend/node_modules/@domain/dist

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "./apps/backend/dist/index.js"]