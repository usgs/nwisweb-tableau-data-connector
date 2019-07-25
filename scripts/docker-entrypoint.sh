#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
npm install
npm --loglevel silent run vars > currVerNum.txt
npm --no-git-tag-version version $versionType --force > newVerNum.txt
npm run production-build
