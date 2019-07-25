FROM node:12.4.0-stretch

RUN apt-get update && apt-get install -y jq

COPY ./scripts/docker-entrypoint.sh /usr/local/bin/
COPY . /usr/local/bin/nwisweb-tableau-data-connector
COPY ./versionType.txt /usr/local/bin/nwisweb-tableau-data-connector

ENTRYPOINT ["docker-entrypoint.sh"]
