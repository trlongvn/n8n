# n8n Build Cache Image

Docker image chứa toàn bộ dependencies đã được cài sẵn, cho phép build n8n **offline** mà không cần kết nối internet.

## Tổng quan

```
┌─────────────────────────────────────┐
│  Dockerfile (build-cache)           │
│  ┌───────────────────────────────┐  │
│  │ node:22-alpine + pnpm 10.22  │  │
│  │ + ALL node_modules installed  │  │
│  │ (no source code)             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                │
                ▼ Dùng làm base image
┌─────────────────────────────────────┐
│  Dockerfile.build (offline build)   │
│  ┌───────────────────────────────┐  │
│  │ COPY source code             │  │
│  │ pnpm build (--network=none)  │  │
│  │ → /app/compiled/             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Quick Start

### 1. Build cache image (cần internet)

```bash
# Từ root project
./docker/images/n8n-build-cache/build-cache.sh

# Hoặc trực tiếp
docker build -f docker/images/n8n-build-cache/Dockerfile -t n8n-build-cache:latest .
```

### 2. Build n8n offline (không cần internet)

```bash
docker build -f docker/images/n8n-build-cache/Dockerfile.build \
  --network=none \
  --build-arg CACHE_IMAGE=n8n-build-cache:latest \
  -t n8n-built:latest .
```

### 3. One-step (cache + build)

```bash
./docker/images/n8n-build-cache/build-cache.sh --build
```

## Cách hoạt động

1. **Cache image** chỉ copy các file dependency (`package.json`, `pnpm-lock.yaml`, `patches/`) rồi chạy `pnpm install --frozen-lockfile`
2. Docker cache layer này hiệu quả — chỉ rebuild khi dependencies thay đổi
3. **Build image** dùng cache image làm base, copy source code vào, rồi build offline

## Khi nào cần rebuild cache?

Rebuild cache image khi:
- Thêm/xóa/thay đổi dependencies trong bất kỳ `package.json` nào
- Cập nhật `pnpm-lock.yaml`
- Thay đổi patches trong `patches/`

**Không cần rebuild** khi chỉ thay đổi source code (`.ts`, `.vue`, `.js`, ...).
