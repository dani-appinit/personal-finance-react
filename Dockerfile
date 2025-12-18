# syntax=docker/dockerfile:1

## Build stage: compile Vite app to static assets
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

# Copy source and build
COPY . .
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

## Runtime stage: serve with Nginx
FROM nginx:alpine AS runner

# Replace default server config with SPA-friendly routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]