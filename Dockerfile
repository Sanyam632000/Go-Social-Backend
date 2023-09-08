# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR .
# Copy package.json and package-lock.json
COPY package*.json ./

# Remove existing node_modules (if any)
RUN rm -rf node_modules

# Install app dependencies
RUN npm install

# uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# install the bcrypt modules for the machine
RUN npm install bcrypt

# Copy app source code
COPY . .

# Expose port
EXPOSE 3030

# Start the backend server
CMD ["node", "index.js"]
