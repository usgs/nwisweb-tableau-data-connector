#!/bin/bash

versionNum=`cat versionNum.txt`
cat versionNum.txt
cd usr/local/bin/nwisweb-tableau-data-connector
npm install
npm version "$versionNum"
npm run production-build

