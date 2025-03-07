FROM nginx:stable-alpine

# Set API_URL dynamically
ARG API_URL
ENV API_URL=${API_URL}

# Copy frontend files
COPY . /usr/share/nginx/html

# Inject environment variable into script.js
RUN if [ -n "$API_URL" ]; then \
  sed -i "s|__API_URL__|$API_URL|g" /usr/share/nginx/html/script.js; \
  fi

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
