# ==============================================================================
# SMART SCHOLARSHIP ELIGIBILITY SYSTEM - FRONTEND DOCKERFILE (Multi-stage Build)
# ==============================================================================

# Stage 1: Build the React Application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Build argument for API Base URL (defaults to localhost:8000/api/v1)
ARG REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Copy frontend source tree
COPY . ./

# Build production bundle
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine

# Remove default nginx site
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
