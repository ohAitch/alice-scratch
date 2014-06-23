#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3
#chmod -R 755 bin &>/dev/null

exr bin/main.js main.ξ tmp/main.js
exr tmp/main.js main.ξ tmp/1/main.js
exr tmp/1/main.js main.ξ tmp/2/main.js
exr tmp/2/main.js main.ξ tmp/3/main.js
# if [ $? = 0 ]; then
# 	echo '--- success ---'
# 	cp bin/main.js bin/main.js.bak
# 	cp tmp/3/main.js bin/main.js
# fi