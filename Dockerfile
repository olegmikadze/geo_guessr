# Base image
FROM node:20

ENV ACCESS_SECRET access_very_secret
ENV EXPIRES_IN_15M 900000
ENV REFRESH_SECRET refresh_very_secret
ENV EXPIRES_IN_7D 604800000
ENV MONGO_URL mongodb+srv://olehvmikadze:y0r2bwxpE6ipkYsr@cluster0.lwnuv5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV HTTP_TIMEOUT 5000
ENV HTTP_MAX_REDIRECTS 5
ENV IPSTACK_SECRET c78658a320cafcf13e76024337931b07

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