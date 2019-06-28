#!/bin/bash

pwd
ls -al
versionNum=`cat versionNum.txt`
cat versionNum.txt
cd usr/local/bin/nwisweb-tableau-data-connector
npm install
git add .
git commit -m "automated version number update"
git push origin autoversion-test
npm version patch
npm run production-build

