#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."

ζ ' keep_alive(φ`server.ζ`.root("/")+"") ;'
