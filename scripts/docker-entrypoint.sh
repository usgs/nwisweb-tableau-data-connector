#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
destination=`cat destination.txt`
npm install
npm ls --depth 0 --json | jq '.version' | sed -e 's/^"//' -e 's/"$//' > currVerNum.txt
if [ "$destination" = "Production" ] || [ "$destination" = "Beta" ]
then
npm run productionAnalytics
echo "Production Build: Injecting Analytics"
else
echo "Development Build: Not Injecting Analytics"
fi




npm run production-build
npm --no-git-tag-version version $versionType --force > newVerNum.txt
