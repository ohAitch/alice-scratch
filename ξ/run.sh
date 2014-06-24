#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3

exr η.js ξ.η .
exr     ξ.js   ξ.ξ tmp
exr tmp/ξ.js   ξ.ξ tmp/1
exr tmp/1/ξ.js ξ.ξ tmp/2
exr tmp/2/ξ.js ξ.ξ tmp/3
if [ $? = 0 ]; then
echo '--- success ξ ---'

exr       η.js η.η tmp  ; exr ξ.js   tmp/η.ξ .
exr   tmp/η.js η.η tmp/1; exr ξ.js tmp/1/η.ξ .
exr tmp/1/η.js η.η tmp/2; exr ξ.js tmp/2/η.ξ .
exr tmp/2/η.js η.η tmp/3; exr ξ.js tmp/3/η.ξ .
if [ $? = 0 ]; then
echo '--- success η ---'

exr       φ.js φ.φ tmp  ; exr η.js   tmp/φ.η .; exr ξ.js   tmp/φ.ξ .
exr   tmp/φ.js φ.φ tmp/1; exr η.js tmp/1/φ.η .; exr ξ.js tmp/1/φ.ξ .
exr tmp/1/φ.js φ.φ tmp/2; exr η.js tmp/2/φ.η .; exr ξ.js tmp/2/φ.ξ .
exr tmp/2/φ.js φ.φ tmp/3; exr η.js tmp/3/φ.η .; exr ξ.js tmp/3/φ.ξ .
if [ $? = 0 ]; then
echo '--- success φ ---'

fi
fi
fi

rm ξ.ξ