#!/usr/bin/env bash

mkdir bin

gcc -Wall -pedantic -O3 -o bin/mimic mimic.c

ln -sf /usr/local/lib/node_modules/zeta-lang/lazy_mimic.sh bin/ζλ

./compiler.js bin/index.js
