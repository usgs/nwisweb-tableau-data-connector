#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionNum=`cat versionNum.txt`
npm install
npm version $versionNum --force
npm run production-build

