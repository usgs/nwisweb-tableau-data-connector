#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionNum.txt`
cat versionNum.txt
npm install
npm --no-git-tag-version version $versionType --force >newVerNum.txt
npm run production-build

