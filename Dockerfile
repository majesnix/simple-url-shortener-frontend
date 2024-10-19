# stage 1 - build react app
FROM node:alpine AS builder

ARG VITE_BASE
ARG VITE_API

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --update \
  && apk add --no-cache ca-certificates \
  && yarn --frozen-lockfile

COPY . .

RUN yarn build

# stage 2 - build final image
FROM nginx:alpine

ARG VERSION

LABEL name="sus-frontend"
LABEL version={VERSION}
LABEL maintainer="majesnix <majesnix@majesnix.org>"

COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]