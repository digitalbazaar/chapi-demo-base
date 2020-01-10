FROM node:12-alpine AS base
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .

FROM base AS build
RUN apk add --no-cache git bash autoconf automake libtool binutils gcc g++ make python
USER node
WORKDIR /home/node/app
RUN npm ci --no-optional --production
RUN cd vue-components && npm i
RUN cd vue-components && npm run build-production

FROM base AS release
COPY --from=build /home/node/app/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/app/vue-components/dist ./vue-components/dist
EXPOSE 10443
CMD [ "node", "lib/index.js"]
