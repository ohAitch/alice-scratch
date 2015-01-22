#!/usr/bin/env bash
mydir='cd $(dirname "${BASH_SOURCE[0]}")'
eval $mydir

ζ₂ -c index.ζ₂ .
exr ./index.js "$@"
rm index.js
