#!/usr/bin/env bash
for t in $(cat to.txt)/*; do echo $t; done | sort -n | tail -n 1
