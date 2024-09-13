FROM nginx:stable-alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/config.json /config/config.json
CMD envsubst < /config/config.json > /usr/share/nginx/html/config.json && \
  exec nginx -g 'daemon off;'
