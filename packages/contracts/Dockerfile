# Use Node.js LTS version
FROM node:18-alpine

# Install required build tools
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Compile contracts
RUN npm run compile

# Set environment variables
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8545', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

# Command to run tests and deployment
CMD ["npm", "run", "test"]