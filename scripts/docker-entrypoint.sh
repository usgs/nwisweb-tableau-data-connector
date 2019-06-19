#!/bin/bash


cd usr/local/bin/nwisweb-tableau-data-connector
if npm run test:unit; then
    npm run build
    echo "built!"
else
    echo "failed!"
fi


