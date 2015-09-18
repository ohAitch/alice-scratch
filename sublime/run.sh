#!/usr/bin/env bash

in=Packages
out=~/Library/Application\ Support/Sublime\ Text\ 3/Packages

# translate sane stuff into weird sublime formats and put it in the sublime places
# then, delete files in the sublime places that we didn't write to (except for specialized exceptions)
transform/index.sh to "../$in" "$out"
