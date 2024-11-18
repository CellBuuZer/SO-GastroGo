# Use an official nginx image to serve the static files
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy the front-end files into the container
COPY . /usr/share/nginx/html

# Expose port 80 to access the web server
EXPOSE 80

# Start nginx server when the container runs
CMD ["nginx", "-g", "daemon off;"]