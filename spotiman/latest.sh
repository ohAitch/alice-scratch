#!/usr/bin/env bash
cd $(dirname $(realpath "${BASH_SOURCE[0]}"))
for t in $(cat to.txt)/*; do echo $t; done | sort -n | tail -n 1
