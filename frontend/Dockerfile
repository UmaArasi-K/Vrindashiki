# ⚠️  THIS DOCKERFILE IS NOT USED BY CLOUD BUILD / CLOUD RUN.
#
# The root-level Dockerfile (../../Dockerfile) is the one used for deployment.
# It is a multi-stage build that:
#   1. Builds the Vite frontend (this folder)
#   2. Compiles the Express backend
#   3. Produces a single production image where Express serves both the API
#      and this compiled React app on port 8080.
#
# This file is kept for reference only — e.g. if you ever want to run the
# frontend as a standalone Nginx container for local testing:
#
#   cd frontend && npm run build
#   docker build -t vrindashiki-frontend .
#   docker run -p 8080:8080 vrindashiki-frontend

FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
