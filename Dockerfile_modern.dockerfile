FROM node:lts-alpine as base
RUN corepack enable pnpm

# BUILDER ---------------------------------------------------------------------
  
FROM base AS builder
WORKDIR /app
RUN echo "store-dir = /app/.pnpm-store" > .npmrc
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/app/.pnpm-store pnpm install --frozen-lockfile --no-optional
# RUN --mount=type=cache,target=/app/.pnpm-store pnpm add -D @next/swc-linux-x64-musl @next/swc-linux-x64-gnu
COPY . .
COPY next.config.docker.js next.config.js
RUN --mount=type=cache,target=/app/.next/cache --mount=type=cache,target=/app/.pnpm-store pnpm run build

# RUNNER ----------------------------------------------------------------------

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]