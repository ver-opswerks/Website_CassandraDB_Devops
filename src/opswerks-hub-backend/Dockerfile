# Use Node.js as the base image for backend
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY ./ ./

# Expose port 5000 for the backend API
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
