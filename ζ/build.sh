#!/usr/bin/env bash

t=$(ps -ax | grep node | grep server.ζ | awk '{print $1}'); ! [ -z "$t" ] && kill $t

[[ $(jq .version package.json) = $(jq .version /usr/local/lib/node_modules/$(jq -r .name package.json)/package.json) ]] && npm --no-git-tag-version version patch

npm install -g .
