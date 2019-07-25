#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
npm install
npm ls --depth 0 --json | /us/bin/jq '.version' > currVerNum.txt
npm --no-git-tag-version version $versionType --force > newVerNum.txt
npm run production-build
