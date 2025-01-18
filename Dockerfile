# Build stage
FROM node:20-alpine AS builder

# Install pnpm (since package.json indicates pnpm is the package manager)
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies and cross-env explicitly
RUN pnpm install --prod --frozen-lockfile && \
    pnpm add cross-env

# Copy built assets from builder stage
COPY --from=builder /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]