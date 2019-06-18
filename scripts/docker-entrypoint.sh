#!/bin/bash

echo 'Hello World!'
ls
npm --version
cd usr 
ls
cd games
ls 
cd ..
cd local
echo "inside local"
ls
cd bin 
ls
echo "inside bin"
cd nwisweb-tableau-data-connector

npm run test:unit
#todo stop if the tests fail

npm run build

echo "built!"