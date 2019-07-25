#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
npm install
npm ls --depth 0 --json | jq '.version' | sed -e 's/^"//' -e 's/"$//' > currVerNum.txt
npm --no-git-tag-version version $versionType --force
npm run production-build
