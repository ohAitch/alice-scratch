rm bin/*
load/load.js load.a bin/load.js
bin/load.js load.a bin/load2.js
bin/load2.js load.a bin/load3.js
bin/load3.js load.a bin/load4.js
bin/load4.js load.a bin/load5.js
if [ $? = 0 ]; then
	echo '--- success ---'
	cp load/load.js load/load.js.bak
	cp bin/load2.js load/load.js
fi