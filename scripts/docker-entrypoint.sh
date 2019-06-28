#!/bin/bash


cd usr/local/bin/nwisweb-tableau-data-connector
npm install
versionNum=`cat versionNum.txt`
npm version "$versionNum"
npm run production-build

