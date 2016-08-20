#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || export PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || export PATH="./node_modules/.bin:$PATH:."

ζ ' keep_alive(φ`server.ζ`.root("/")+"") ;'
