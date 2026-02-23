# n8n Custom Build — Production Deployment

Build và chạy n8n với kiến trúc **main + worker** sử dụng Docker Compose.

## Kiến trúc

```
┌─────────────────┐     ┌──────────┐     ┌─────────────────┐
│   n8n-main      │────▶│  Redis   │◀────│   n8n-worker    │
│  (UI + API +    │     │  (Queue) │     │  (Xử lý jobs)   │
│   Webhooks)     │     └──────────┘     │  Scale: 1..N    │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         └──────────┬─────────────────────────────┘
                    ▼
             ┌──────────────┐
             │  PostgreSQL  │
             │  (Database)  │
             └──────────────┘
```

## Quick Start

### 1. Build cache image (chỉ cần chạy 1 lần, hoặc khi dependencies thay đổi)

```bash
./docker/images/n8n-build-cache/build-cache.sh
```

### 2. Build production image

```bash
# Cần tạm thay .dockerignore (giống build-cache)
# Backup
cp .dockerignore .dockerignore.bak

# Tạo .dockerignore permissive
echo -e ".git\nnode_modules\ndist\ncompiled\ncoverage\n*.log\n.env*\n.vscode\n.devcontainer\n.github\n.agent\n.claude" > .dockerignore

# Build
docker build -f docker/images/n8n-custom/Dockerfile -t n8n-custom:latest .

# Restore
mv .dockerignore.bak .dockerignore
```

### 3. Start services

```bash
# Copy env template
cp docker/images/n8n-custom/.env.example docker/images/n8n-custom/.env
# Chỉnh sửa .env theo nhu cầu

# Start tất cả
docker compose -f docker/images/n8n-custom/docker-compose.yml up -d

# Chỉ main server (không worker)
docker compose -f docker/images/n8n-custom/docker-compose.yml up -d n8n-main

# Scale workers
docker compose -f docker/images/n8n-custom/docker-compose.yml up -d --scale n8n-worker=3
```

### 4. Truy cập

- **UI**: http://localhost:5678
- **API**: http://localhost:5678/api/v1

## Chế độ hoạt động

| Service | Command | Chức năng |
|---------|---------|-----------|
| `n8n-main` | `n8n` (default) | UI, REST API, webhook receiver, trigger workflows |
| `n8n-worker` | `n8n worker` | Xử lý workflow executions từ queue |

> **Lưu ý**: `N8N_ENCRYPTION_KEY` **phải giống nhau** giữa main và worker.

## Các lệnh hữu ích

```bash
# Xem logs
docker compose -f docker/images/n8n-custom/docker-compose.yml logs -f n8n-main
docker compose -f docker/images/n8n-custom/docker-compose.yml logs -f n8n-worker

# Restart worker
docker compose -f docker/images/n8n-custom/docker-compose.yml restart n8n-worker

# Stop tất cả
docker compose -f docker/images/n8n-custom/docker-compose.yml down

# Stop + xóa data
docker compose -f docker/images/n8n-custom/docker-compose.yml down -v
```
