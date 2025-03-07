FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first for optimal caching
COPY package*.json ./
RUN npm ci --omit=dev --quiet

# Copy remaining files
COPY . .

# Expose backend port (e.g., 3000)
EXPOSE 3000

# Start your Node.js backend
CMD ["node", "index.js"]
