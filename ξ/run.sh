#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3

φ ξ.φ .; η ξ.η .
        ξ      ξ.ξ tmp
exr tmp/ξ.js   ξ.ξ tmp/1
exr tmp/1/ξ.js ξ.ξ tmp/2
exr tmp/2/ξ.js ξ.ξ tmp/3
if [ $? != 0 ]; then exit; fi
echo '--- success ξ ---'
cp tmp/3/ξ.js ξ; ex ξ

φ η.φ .
          η    η.η tmp  ; ξ   tmp/η.ξ   tmp/
exr   tmp/η.js η.η tmp/1; ξ tmp/1/η.ξ tmp/1/
exr tmp/1/η.js η.η tmp/2; ξ tmp/2/η.ξ tmp/2/
exr tmp/2/η.js η.η tmp/3; ξ tmp/3/η.ξ tmp/3/
if [ $? != 0 ]; then exit; fi
echo '--- success η ---'
cp tmp/3/η.js η; ex η

          φ    φ.φ tmp  ; η   tmp/φ.η   tmp/; ξ   tmp/φ.ξ   tmp/
exr   tmp/φ.js φ.φ tmp/1; η tmp/1/φ.η tmp/1/; ξ tmp/1/φ.ξ tmp/1/
exr tmp/1/φ.js φ.φ tmp/2; η tmp/2/φ.η tmp/2/; ξ tmp/2/φ.ξ tmp/2/
exr tmp/2/φ.js φ.φ tmp/3; η tmp/3/φ.η tmp/3/; ξ tmp/3/φ.ξ tmp/3/
if [ $? != 0 ]; then exit; fi
echo '--- success φ ---'
cp tmp/3/φ.js φ; ex φ

rm *.ξ; rm *.η