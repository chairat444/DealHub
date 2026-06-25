FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3002
ENV HOST=0.0.0.0
ENV PORT=3002
CMD ["node", ".output/server/index.mjs"]
