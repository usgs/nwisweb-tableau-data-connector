#!/bin/bash

pwd
ls -al
versionNum=`cat versionNum.txt`
cat versionNum.txt
cd usr/local/bin/nwisweb-tableau-data-connector
npm install
npm version patch

git add .
git commit -m "automated version number update"
npm run production-build

