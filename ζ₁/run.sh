#!/usr/bin/env bash
eval $mydir

rm -r t; mkdir t; mkdir t/1; mkdir t/2; mkdir t/3; mkdir t/bin

bin/ζ₁c *.ζ₁ t/1; ex t/1
t/1/ζ₁c *.ζ₁ t/2; ex t/2
t/2/ζ₁c *.ζ₁ t/3; ex t/3
t/3/ζ₁c *.ζ₁ t/bin; ex t/bin
if [ $? != 0 ]; then exit; fi
echo '--- success ---'
cp -r t/bin .