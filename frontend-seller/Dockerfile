# Use Bun base image
FROM oven/bun:1.2-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json, bun.lockb, and other necessary files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your app
COPY . .

# Build the Next.js app
RUN bun run build

# Expose the port your app uses
EXPOSE 3001

# Start the Next.js app
CMD ["bun", "run", "start", "-p", "3001"]
