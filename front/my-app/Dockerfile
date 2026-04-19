# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json
COPY package*.json ./
RUN npm install

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Финальный образ с Nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]