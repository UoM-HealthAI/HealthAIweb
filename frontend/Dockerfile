# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first (Docker caching optimization)
COPY package*.json ./

# Install dependencies (clean cache to minimize image size)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables for proper hot reload in Docker
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Run development server with proper hot reload settings
CMD ["npm", "start"] 