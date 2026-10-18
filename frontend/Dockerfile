FROM node:22-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM base AS builder
ARG NEXT_PUBLIC_API_URL=
ARG API_INTERNAL_URL=http://backend:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV API_INTERNAL_URL=${API_INTERNAL_URL}
COPY --from=dependencies /app/node_modules ./node_modules
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
