#!/usr/bin/env bash
cd "$(dirname $(/usr/local/bin/realpath "${BASH_SOURCE[0]}"))"

trap end EXIT; end(){ rm -rf experimental node node_modules; }

tar --xz -xf '*.tar.xz' -C .
./node --harmony ./node_modules/zeta-lang/bootstrap.js ./spotify-dl.ζ
