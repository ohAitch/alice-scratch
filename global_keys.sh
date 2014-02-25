#!/bin/bash

r='output of most recently called function'

pause() { read -p 'Press [Enter] to continue . . .'; }
#slash_back() { r=$(echo "$1" | sed 's/\//\\/g'); }
#cygpath_w() { local t=`pwd`; cd "$1"; r=`pwd -W`; cd "$t"; }

t="out/ahk.ahk"
u="out/temp"

cp global_keys.ahk.c "$t"
sed -r -i -e 's/\{/{NEWLINE /g' "$t"
sed -r -i -e 's/\}/ NEWLINE}/g' "$t"
perl -p -i -e 's/(?<!\\)‹/{/g' "$t"
perl -p -i -e 's/(?<!\\)›/}/g' "$t"
perl -p -i -e 's/\\‹/‹/g' "$t"
perl -p -i -e 's/\\›/›/g' "$t"
sed -r -i -e 's/ ?; ?/ NEWLINE /g' "$t"
sed -r -i -e 's/###/HASH/g' "$t"
cpp -P "$t" -o "$u" ; cp "$u" "$t"
python 'unicode_filter.py' "$t"
sed -r -i -e 's/ ?NEWLINE ?/\n/g' "$t"
sed -r -i -e 's/HASH/#/g' "$t"
sed -r -i -e 's/COMMA/,/g' "$t"
sed -r -i -e 's/SEMICOLON/`;/g' "$t"
sed -r -i -e "s/QUOTE/'/g" "$t"
sed -r -i -e 's/\\\\/\\/g' "$t"

hstart64 //NOCONSOLE "AutoHotkey out/ahk.ahk"