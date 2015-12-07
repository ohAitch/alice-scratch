#!/usr/bin/env bash

echo this has been unpublished already
exit

npm version patch
npm publish .
npm install zeta0 -g
ln -s /usr/local/lib/node_modules/zeta0/ζ₀ /usr/local/bin &>/dev/null
