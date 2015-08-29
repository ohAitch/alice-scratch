#!/usr/bin/env bash
to=$(cat to.txt)
echo $(for t in $to/*; do echo $t; done | sort -n | tail -n 1)
