#!/usr/bin/env bash
trap end EXIT; end(){ rm -rf .bin/index{2,3}.js; }

npm --cache-min=Infinity install --ignore-scripts

.bin/index.js ' φ`.bin/index2.js`.text = ζ_compile(φ`index.ζ`.text) ;' && chmod +x .bin/index2.js &&
.bin/index2.js ' φ`.bin/index3.js`.text = ζ_compile(φ`index.ζ`.text) ;' &&
diff .bin/index{2,3}.js && {
	.bin/index.js ' φ`.bin/parsimmon2.js`.text = ζ_compile(φ`parsimmon2.ζ`.text) ;'
	mv .bin/index2.js .bin/index.js
	}
