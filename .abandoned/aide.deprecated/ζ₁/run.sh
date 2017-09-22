#!/usr/bin/env bash
export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
eval $mydir

rm -r t; mkdir t; mkdir t/1; mkdir t/2; mkdir t/3; mkdir t/bin
bin/ζ₁c *.ζ₁ t/1  ; if [ $? != 0 ]; then echo '--- 0 failed ---'; exit; fi
t/1/ζ₁c *.ζ₁ t/2  ; if [ $? != 0 ]; then echo '--- 1 failed ---'; exit; fi
t/2/ζ₁c *.ζ₁ t/3  ; if [ $? != 0 ]; then echo '--- 2 failed ---'; exit; fi
t/3/ζ₁c *.ζ₁ t/bin; if [ $? != 0 ]; then echo '--- 3 failed ---'; exit; fi
echo '--- success ---'
cp -r t/bin .
