FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY domain/package.json ./domain/
COPY domain/tsconfig.json ./domain/

COPY apps/frontend/src ./apps/frontend/src
COPY domain/src ./domain/src

RUN npm install

RUN npm run build --workspace=domain

RUN npm run build --workspace=apps/frontend

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]