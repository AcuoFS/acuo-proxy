FROM node:latest

# Install forever as global module (root previlledges might be required)
RUN npm i -g forever

# Copy acuo-proxy files to /usr/src/app and change directory
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install node modules
RUN npm install

# Set environment variables 
ENV PORT = 8181

EXPOSE 8181

# Start app from forever:
CMD forever start index.js