#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || export PATH="/usr/local/bin:$PATH"
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

gcc -Wall -pedantic -O3 -o "$1" "$__dirname"/mimic.c
