#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3

exr main.ξc.js main.ξ tmp
exr tmp/main.ξc.js main.ξ tmp/1
exr tmp/1/main.ξc.js main.ξ tmp/2
exr tmp/2/main.ξc.js main.ξ tmp/3
if [ $? = 0 ]; then
	echo '--- success ---'
	cp main.ξc.js main.ξc.js.bak
	cp tmp/3/main.ξc.js main.ξc.js
fi