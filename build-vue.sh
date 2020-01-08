#!/bin/bash

cd vue-components

if [ ! -d "node_modules" ]
then
    echo "Directory vue-components/node_modules DOES NOT exists. Running npm install..."
    npm install
fi

npm run build

cd ..
