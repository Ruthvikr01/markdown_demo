FROM node:22-alpine

# Sets a stable working directory inside the container.
WORKDIR /app

# Copies only dependency manifests first to maximize Docker layer caching.
COPY package*.json ./

# Installs production dependencies only for smaller image size.
RUN npm install 

# Copies application source after dependencies are installed.
COPY . .

EXPOSE 4000

# Starts the backend server process.
CMD ["npm", "start"]
