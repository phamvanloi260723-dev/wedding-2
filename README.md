# Wedding App

## Yêu cầu

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

## Chạy với Docker

### 1. Build & start (port mặc định 3000)

```bash
docker compose up -d --build
```

Truy cập: **http://localhost:3000**

### 2. Đổi port

Dùng biến `PORT` để thay đổi port:

```bash
PORT=8080 docker compose up -d --build
```

Truy cập: **http://localhost:8080**

### 3. Dừng container

```bash
docker compose down
```

### 4. Xem logs

```bash
docker compose logs -f
```

### 5. Rebuild lại khi có thay đổi code

```bash
docker compose up -d --build --force-recreate
```
