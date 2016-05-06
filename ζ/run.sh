#!/usr/bin/env bash

# oh, this was the server killer
# t=$(ps aux | grep 'uqo4hqvayc3m1jo[r]' | awk '{print $2}'); ! [ -z "$t" ] && kill $t

[[ $(jq .version package.json) = $(jq .version /usr/local/lib/node_modules/$(jq -r .name package.json)/package.json) ]] && npm --no-git-tag-version version patch

npm install -g .
