#!/bin/bash

jsdoc -c jsdoc.conf.json -d ./docs/html/ --verbose lib/ && jsdox --output docs/markdown/ lib/