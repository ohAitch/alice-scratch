#!/usr/bin/env bash

kill $(ps aux | grep 'uqo4hqvayc3m1jo[r]' | awk '{print $2}')

[[ $(jq .version package.json) = $(jq .version /usr/local/lib/node_modules/$(jq -r .name package.json)/package.json) ]] && npm --no-git-tag-version version patch

npm install -g .
