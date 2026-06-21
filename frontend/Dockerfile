# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY dist /usr/share/nginx/html

# Copy a custom nginx configuration to handle React Router navigation
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run's default port requirement can also be mapped, but 8080 is standard)
EXPOSE 8080

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
