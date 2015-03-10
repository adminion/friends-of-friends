#!/bin/bash

prefix='./node_modules'

if [ ! -d "$prefix/jsdoc" ]
then 
	npm install jsdoc
fi

if [ ! -d "$prefix/jsdoc-to-markdown" ]
then 
 	npm install jsdoc-to-markdown
fi

jsdoc -c jsdoc.conf.json -d ./docs/ -R ./README.md --verbose ./lib/

jsdoc2md lib/*.js > ./docs/FriendsOfFriends.md
