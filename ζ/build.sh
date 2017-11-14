#!/usr/bin/env bash
trap end EXIT; end(){ rm -rf .bin/it{2,3,4}.js; }

npm --cache-min=Infinity install --ignore-scripts

.bin/it.js ' φ`.bin/it2.js`.text = ζ_compile(φ`it.ζ`.text) ;' && chmod +x .bin/it2.js &&
.bin/it2.js ' φ`.bin/it3.js`.text = ζ_compile(φ`it.ζ`.text) ;' && chmod +x .bin/it3.js &&
.bin/it3.js ' φ`.bin/it4.js`.text = ζ_compile(φ`it.ζ`.text) ;' && chmod +x .bin/it4.js &&
diff .bin/it{3,4}.js && {
	.bin/it.js ' φ`.bin/parsimmon2.js`.text = ζ_compile(φ`parsimmon2.ζ`.text) ;'
	mv .bin/it3.js .bin/it.js
	}
