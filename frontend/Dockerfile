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

# Run development server
CMD ["npm", "start"] 