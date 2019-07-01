#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
pwd
ls -al
versionNum=`cat versionNum.txt`
cat versionNum.txt
npm install
npm --no-git-tag-version version $versionNum --force
npm run production-build

