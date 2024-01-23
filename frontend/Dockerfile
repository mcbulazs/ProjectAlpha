# Use an official Node runtime as a parent image
FROM node:20.11

# Set the working directory in the container
WORKDIR /front-app

# Copy the application code to the container
COPY . .

# Install app dependencies
RUN npm install -g @angular/cli

RUN npm install

# Build the Angular app
RUN ng build

# Expose the port the app runs on
EXPOSE 4200

# Define the command to run your app using CMD which runs when the container starts
CMD ["ng", "serve", "--host", "0.0.0.0"]
