FROM alpine
MAINTAINER Ebrahim Byagowi "<ebrahim@gnu.org>"
ADD chat.html index.js package.json /app/
WORKDIR /app
RUN apk update && apk add nodejs nodejs-npm && cd /app && npm install
EXPOSE 80/tcp
ENV PORT 80
ENTRYPOINT node index.js
