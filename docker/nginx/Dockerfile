FROM nginx:stable-alpine

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir /static
COPY static /static

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/