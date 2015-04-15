#!/bin/bash

if [ -d "./coverage" ]
then 
    rm -rf coverage/
fi

./node_modules/.bin/istanbul cover --hook-run-in-context ./node_modules/mocha/bin/_mocha --report html -- -R spec tests
