FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY out/ /usr/share/nginx/html/
RUN echo '<html><head><meta http-equiv="refresh" content="0;url=/login"></head></html>' > /usr/share/nginx/html/index.html
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;

    # Proxy IAM API calls to Hanzo IAM backend
    # This allows id.ad.nexus/api/* to work without CORS issues
    location /api/ {
        proxy_pass https://iam.hanzo.ai/api/;
        proxy_set_header Host iam.hanzo.ai;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    # Proxy OAuth endpoints to IAM backend
    location /login/oauth/ {
        proxy_pass https://iam.hanzo.ai/login/oauth/;
        proxy_set_header Host iam.hanzo.ai;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri.html $uri/ /login.html;
    }

    location /health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
