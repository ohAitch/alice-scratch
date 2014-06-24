#!/usr/bin/env bash
eval $mydir

rm -r tmp; mkdir tmp; mkdir tmp/1; mkdir tmp/2; mkdir tmp/3

exr main.ξc.js main.ξ tmp
exr tmp/main.ξc.js main.ξ tmp/1
exr tmp/1/main.ξc.js main.ξ tmp/2
exr tmp/2/main.ξc.js main.ξ tmp/3
if [ $? = 0 ]; then

echo '--- success ξ ---'
cp main.ξc.js main.ξc.js.bak
cp tmp/3/main.ξc.js main.ξc.js

exr main.ηc.ξc.js       main.η tmp  ; exr main.ξc.js tmp/main.ηc.ξ .
exr tmp/main.ηc.ξc.js   main.η tmp/1; exr main.ξc.js tmp/1/main.ηc.ξ .
exr tmp/1/main.ηc.ξc.js main.η tmp/2; exr main.ξc.js tmp/2/main.ηc.ξ .
exr tmp/2/main.ηc.ξc.js main.η tmp/3; exr main.ξc.js tmp/3/main.ηc.ξ .
if [ $? = 0 ]; then

echo '--- success η ---'
cp main.ηc.ξc.js main.ηc.ξc.js.bak
cp tmp/3/main.ηc.ξc.js main.ηc.ξc.js

fi
fi