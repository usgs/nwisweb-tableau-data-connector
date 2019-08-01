#!/bin/bash

cd usr/local/bin/nwisweb-tableau-data-connector
versionType=`cat versionType.txt`
destination=`cat destination.txt`
npm install
npm ls --depth 0 --json | jq '.version' | sed -e 's/^"//' -e 's/"$//' > currVerNum.txt
if [ "$destination" = "Production" ] || [ "$destination" = "Beta" ]
then
npm run production-build
echo "Production Build: Injecting Analytics"
else
npm run development-build
echo "Development Build: Not Injecting Analytics"
fi


npm --no-git-tag-version version $versionType --force > newVerNum.txt

newVersion=`cat newVerNum.txt`
npm run update-code-json -- $newVersion
