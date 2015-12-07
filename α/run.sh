#!/usr/bin/env bash
ex() { chmod -R 755 "$1" &>/dev/null; }
export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
eval $mydir

rm bin/*
mkdir bin
load/load.js load.α bin/load.js
ex bin
bin/load.js test.α bin/test.js
#bin/load.js load.α bin/load2.js
#bin/load2.js load.α bin/load3.js
#bin/load3.js load.α bin/load4.js
#bin/load4.js load.α bin/load5.js
#if [ $? = 0 ]; then
#	echo '--- success ---'
#	cp load/load.js load/load.js.bak
#	cp bin/load2.js load/load.js
#fi
