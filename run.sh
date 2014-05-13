#!/usr/bin/env bash
eval $mydir

rm bin/*
mkdir bin
load/load.js load.α bin/load.js
chmod -R 755 bin &>/dev/null
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