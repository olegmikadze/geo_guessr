# Base image
FROM node:20

#!! Add env variables from gist "Dockerfile"

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

COPY yarn.lock ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .


# Creates a "dist" folder with the production build
RUN yarn build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["yarn", "start:prod"]