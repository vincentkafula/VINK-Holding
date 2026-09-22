# Backend — Node/Express API
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Writable volume mount point for user-submitted data in production —
# matches DATA_DIR in docker-compose.yml / Railway. The content/ directory
# ships with the image regardless.
RUN mkdir -p /data

EXPOSE 4000
CMD ["node", "server.js"]
