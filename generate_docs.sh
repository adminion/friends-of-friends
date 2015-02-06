#!/bin/bash

jsdoc -c jsdoc.conf.json -d ./docs/html/ --package ./package.json -R ./README.md --verbose ./lib/ && jsdox --output ./docs/markdown/ ./lib/
