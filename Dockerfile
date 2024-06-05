# Use an official Node.js runtime as a parent image

FROM node:16
 
# Set the working directory in the container

WORKDIR /usr/src/app
 
# Copy package.json and package-lock.json if present

COPY package*.json ./
 
# Install dependencies

RUN npm install -f
 
# Bundle app source

COPY . .
 
# Expose port 3000 to the outside world

EXPOSE 3001
 
# Command to run the application

CMD ["npm", "start"]
