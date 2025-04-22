FROM node:20 AS base
WORKDIR /usr/local/app

#######################
# 1. Build Angular App
#######################
FROM base AS client-base
WORKDIR /usr/local/app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

########################
# 2. Build + Test Backend
########################
FROM base AS backend-dev
WORKDIR /usr/local/app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend/spec ./spec
COPY backend/src ./src
CMD ["yarn", "dev"]

FROM backend-dev AS test
RUN yarn test

##########################
# 3. Final Production Image
##########################
FROM base AS final
WORKDIR /usr/local/app
ENV NODE_ENV=production

# Add wait-on
RUN yarn global add wait-on

# Copy backend code and install only production deps
COPY --from=test /usr/local/app/package.json ./
COPY --from=test /usr/local/app/yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY backend/src ./src

# Copy built Angular app into ./src/static (where Express expects it)
COPY --from=client-base /usr/local/app/client/dist/client/browser /usr/local/app/src/static

EXPOSE 3000
CMD ["sh", "-c", "wait-on tcp:mysql:3306 && node src/index.js"]