# ---- Build stage ----
FROM node:18.20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files first (for better caching)
COPY package*.json ./

# Try npm ci, fallback to npm install if lockfile is out of sync
RUN npm ci --omit=dev || npm install --omit=dev

# Copy rest of the application code
COPY . .

# ---- Runtime stage ----
FROM node:18.20-alpine AS runtime

# Set environment variables
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512"

# Install only runtime dependencies
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont wget

# Set working directory
WORKDIR /app

# Copy built app with node_modules from builder
COPY --from=builder /app /app

# Create non-root user
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nodejs -u 1001 && \
#     chown -R nodejs:nodejs /app

# USER nodejs

# Expose port
EXPOSE 8000

# Healthcheck (expects /health endpoint in your server)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Run the application
CMD ["node", "app.js"]
