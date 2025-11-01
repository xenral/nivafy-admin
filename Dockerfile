# syntax=docker/dockerfile:1

# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies using the lockfile for reproducibility
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image with standalone output
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
USER node

# Copy only the files needed to run the standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "server.js"]
