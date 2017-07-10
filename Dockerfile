FROM mhart/alpine-node:8.1.2

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

# install git, aws-cli
RUN apk --no-cache add git ca-certificates \
    python py-pip py-setuptools groff less && \
    pip --no-cache-dir install awscli

# install PRX aws-secrets scripts
RUN git clone -o github https://github.com/PRX/aws-secrets
RUN cp ./aws-secrets/bin/* /usr/local/bin

ENV TINI_VERSION v0.9.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

WORKDIR /app
EXPOSE 4300

ADD . ./

RUN apk --no-cache add libsass && \
    yarn install --ignore-optional && \
    npm run build && \
    yarn install --production && \
    yarn cache clean && \
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

ENTRYPOINT ["/tini", "--", "./bin/application"]
CMD [ "serve" ]
