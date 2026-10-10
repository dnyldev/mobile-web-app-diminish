# diminish — standalone static frontend (offline-first)
#
# Multi-stage: Node 22 builds the single-file bundle, nginx serves only dist/.
# Build context is this folder; nothing outside it is used.
#
#   Offline/demo (default):  docker build -t diminish-ui .
#   With backend baked in:    docker build --build-arg VITE_API_BASE_URL=http://192.168.1.10:3000 -t diminish-ui .
#
# VITE_API_BASE_URL is baked into the bundle at build time. Empty/unset keeps
# the bundled demo catalogue; a container-side env var cannot change it later.
# Never put secrets in VITE_*. For phone access the URL must be reachable from
# the phone itself (its own localhost is NOT your machine).

FROM node:22-alpine AS build
WORKDIR /app

# Reproducible install from the committed npm lockfile.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Optional public frontend setting, defaults to empty = offline demo mode.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Runtime: static files only — no Node, no node_modules, no source.
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
