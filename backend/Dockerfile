# Use Bun base image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json, bun.lockb, and other necessary files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your app
COPY . .

RUN bunx prisma generate
RUN bunx prisma migrate deploy

# Expose the port your app uses
EXPOSE 8000

# Start the backend server
CMD ["bun", "run", "dev"]
