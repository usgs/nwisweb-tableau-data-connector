#!/bin/bash

pwd
ls -al
versionNum=`cat versionNum.txt`
cat versionNum.txt
cd usr/local/bin/nwisweb-tableau-data-connector
npm install
bumpversion major --allow-dirty
npm run production-build

