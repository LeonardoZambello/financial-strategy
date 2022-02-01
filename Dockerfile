FROM node:14-alpine
# Env
ENV TIME_ZONE=America/Sao_Paulo

# Set the timezone in docker
RUN apk --update add tzdata \
git \
openssh-client \
&& cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
&& echo "America/Sao_Paulo" > /etc/timezone \
&& apk del tzdata


# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app

RUN npm run build

# # Start and run migrations
ENTRYPOINT node dist/main

EXPOSE 3000