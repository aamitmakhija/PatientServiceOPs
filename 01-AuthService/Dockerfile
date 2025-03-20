# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package.json ./
COPY package-lock.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5001 to access the service from outside
EXPOSE 5001

# Start the application
CMD ["npm", "start"]