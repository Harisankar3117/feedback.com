FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# 1. Install Backend Dependencies
COPY package*.json ./
RUN npm install

# 2. Install Frontend Dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 3. Copy the rest of the application code
COPY . .

# 4. Build the React frontend (this uses the 'build' script in your root package.json)
RUN npm run build

# 5. Expose the port your app runs on
EXPOSE 5000

# 6. Start the Express backend server
CMD ["npm", "start"]
