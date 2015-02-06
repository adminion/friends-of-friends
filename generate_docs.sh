#!/bin/bash

jsdoc -c jsdoc.conf.json -d ./docs/ -R ./README.md --verbose ./lib/

jsdoc2md lib/*.js > ./docs/FriendsOfFriends.md
