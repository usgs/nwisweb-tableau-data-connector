#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
npm install
apt-get install jq
npm ls --depth 0 --json | jq '.version' > currVerNum.txt
npm --no-git-tag-version version $versionType --force > newVerNum.txt
npm run production-build
