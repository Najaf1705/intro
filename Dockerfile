#Build stage
FROM node:18-alpine AS build

# WORKING DIR
WORKDIR /app

# copy package files
COPY package.json package-lock.json* ./

# install dependencies
RUN npm ci

# copy all files
COPY . .

# build the app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Working dir
WORKDIR /app

# set Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# copy build files from builder
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Expose the port
EXPOSE 3000

CMD ["npm", "start"]