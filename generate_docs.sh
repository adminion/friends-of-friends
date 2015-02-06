#!/bin/bash

jsdoc -c jsdoc.conf.json -d ./docs/html/ -R README.md --verbose lib/ && jsdox --output docs/markdown/ lib/
