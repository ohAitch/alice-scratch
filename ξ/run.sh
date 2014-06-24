#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3

exr     ξ.ξc.js   ξ.ξ tmp
exr tmp/ξ.ξc.js   ξ.ξ tmp/1
exr tmp/1/ξ.ξc.js ξ.ξ tmp/2
exr tmp/2/ξ.ξc.js ξ.ξ tmp/3
if [ $? = 0 ]; then

echo '--- success ξ ---'
cp ξ.ξc.js ξ.ξc.js.bak
cp tmp/3/ξ.ξc.js ξ.ξc.js

exr       η.ηc.ξc.js η.η tmp  ; exr ξ.ξc.js   tmp/η.ηc.ξ .
exr   tmp/η.ηc.ξc.js η.η tmp/1; exr ξ.ξc.js tmp/1/η.ηc.ξ .
exr tmp/1/η.ηc.ξc.js η.η tmp/2; exr ξ.ξc.js tmp/2/η.ηc.ξ .
exr tmp/2/η.ηc.ξc.js η.η tmp/3; exr ξ.ξc.js tmp/3/η.ηc.ξ .
if [ $? = 0 ]; then

echo '--- success η ---'
cp η.ηc.ξc.js η.ηc.ξc.js.bak
cp tmp/3/η.ηc.ξc.js η.ηc.ξc.js

exr       φ.φc.ηc.ξc.js φ.φ tmp  ; exr η.ηc.ξc.js   tmp/φ.φc.η .; exr ξ.ξc.js   tmp/φ.φc.ηc.ξ .
exr   tmp/φ.φc.ηc.ξc.js φ.φ tmp/1; exr η.ηc.ξc.js tmp/1/φ.φc.η .; exr ξ.ξc.js tmp/1/φ.φc.ηc.ξ .
exr tmp/1/φ.φc.ηc.ξc.js φ.φ tmp/2; exr η.ηc.ξc.js tmp/2/φ.φc.η .; exr ξ.ξc.js tmp/2/φ.φc.ηc.ξ .
exr tmp/2/φ.φc.ηc.ξc.js φ.φ tmp/3; exr η.ηc.ξc.js tmp/3/φ.φc.η .; exr ξ.ξc.js tmp/3/φ.φc.ηc.ξ .
if [ $? = 0 ]; then

echo '--- success φ ---'
cp φ.φc.ηc.ξc.js φ.φc.ηc.ξc.js.bak
cp tmp/3/φ.φc.ηc.ξc.js φ.φc.ηc.ξc.js

fi
fi
fi