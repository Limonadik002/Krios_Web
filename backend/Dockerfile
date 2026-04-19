# Этап сборки
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Устанавливаем git для скачивания зависимостей
RUN apk add --no-cache git

# Копируем файлы зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем бинарник
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Финальный образ
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Копируем бинарник из этапа сборки
COPY --from=builder /app/main .

# 🔥 ВАЖНО: Копируем .env файл в рабочую директорию
COPY .env .

EXPOSE 8080

CMD ["./main"]