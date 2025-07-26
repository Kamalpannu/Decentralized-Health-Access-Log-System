# Step 1: Use Node image to build the frontend
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Step 2: Serve built frontend with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and replace
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]