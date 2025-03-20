# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json to the container
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the app will run on
EXPOSE 5002

# Run the application
CMD ["npm", "start"]