#!/usr/bin/env bash

shopt -s extglob

rm -r ~/file/code/tmp/{*,.!(git|.|)} &&
cp -r .??* * ~/file/code/tmp/ &&
cd ~/file/code/tmp/ &&
git add -A &&
git commit -m x &&
git push &&
ζ ' go_to(`https://gomix.com/#!/project/dirty-signaling`) ;'
