# Install forever as global module (root previlledges might be required)
RUN npm i -g forever

# Copy acuo-proxy files to /usr/src/app and change directory
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install node modules
RUN npm install

# Set environment variables 
ENV PORT = 8080

EXPOSE 8080

# Start app from forever:
CMD forever start /usr/src/app/index.js