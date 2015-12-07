#!/usr/bin/env bash
[[ $(jq .version package.json) = $(jq .version /usr/local/lib/node_modules/$(jq -r .name package.json)/package.json) ]] && npm --no-git-tag-version version patch
npm install -g .
