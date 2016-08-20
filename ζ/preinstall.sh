#!/usr/bin/env bash

mkdir bin
gcc -Wall -pedantic -O3 -o bin/mimic mimic.c
./compiler.js bin/index.js

ln -sf /usr/local/lib/node_modules/zeta-lang/bin/index.js bin/ζλ
