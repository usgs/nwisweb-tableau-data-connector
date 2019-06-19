FROM node:12.4.0-stretch

COPY ./scripts/docker-entrypoint.sh /usr/local/bin/
COPY . /usr/local/bin/nwisweb-tableau-data-connector

ENTRYPOINT ["docker-entrypoint.sh"]
