#!/bin/bash


docker build . --tag="test"
docker run test

pathtemplate=":usr/local/bin/nwisweb-tableau-data-connector/dist"
dockerinstanceid=$( docker ps -l -q )
docker cp  $dockerinstanceid$pathtemplate ~/Desktop/build
docker rm $dockerinstanceid