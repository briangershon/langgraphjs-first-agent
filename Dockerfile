FROM node:20
WORKDIR /usr/src/app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile
COPY tsconfig.json ./
COPY . .
