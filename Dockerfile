# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-build
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
RUN npm ci --workspace client

COPY client ./client
RUN npm run build

FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=4000 \
    DB_PATH=/data/ifl.sqlite3

WORKDIR /app

RUN mkdir -p /app/server/data /data

COPY server ./server
COPY --from=frontend-build /app/client/dist ./client/dist

EXPOSE 4000

CMD ["python3", "server/app.py"]
