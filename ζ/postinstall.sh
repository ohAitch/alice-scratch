#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."

gcc -Wall -pedantic -O3 -o .bin/mimic mimic.c

ζ ' restart_and_keep_alive(φ.cwd.φ`server.ζ`+"") ;'
