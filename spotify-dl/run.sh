#!/usr/bin/env bash

tar --xz -xf '*.tar.xz' -C .
./node --harmony ./node_modules/zeta-lang/bootstrap.js ./spotify-dl.ζ
rm -r experimental node node_modules
