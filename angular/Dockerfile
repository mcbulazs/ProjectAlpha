# Use an official Node runtime as a parent image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /front-app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Build the Angular app
RUN npm run build

# Expose the port the app runs on
EXPOSE 4200

# Define the command to run your app using CMD which runs when the container starts
CMD ["npm", "start"]