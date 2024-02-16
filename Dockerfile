# open to using node:21-alpine as well

# builder stage
#FROM node:21-bookworm-slim AS builder
#WORKDIR /build-stage

#COPY package*.json ./
#COPY tsconfig* ./
#COPY jest.config.js ./
#COPY schema.graphql ./

FROM node:21-bookworm
WORKDIR /usr/src/server

COPY . .

RUN npm clean-install

# COPY src ./src

RUN npm run compile

EXPOSE 4000

# COPY --from=builder /build-stage/node_modules ./node_modules
# COPY --from=builder /build-stage/dist ./dist

USER node

CMD ["node", "dist/index.js"]
