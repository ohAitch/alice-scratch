#!/bin/bash

r='output of most recently called function'

pause() { read -p 'Press [Enter] to continue . . .'; }
slash_back() { r=$(echo "$1" | sed 's/\//\\/g'); }
# convert path to windows path
# todo: enhance to handle filenames
cygpath_w() { local t=`pwd`; cd "$1"; r=`pwd -W`; cd "$t"; }

t="$TEMP/global_keys.ahk"
u="$TEMP/global_keys.ahk.tmp"

cp global_keys.ahk.c "$t"
sed -r -i -e 's/ ?#n ?/ NEWLINE /g' "$t"
sed -r -i -e 's/###/HASH/g' "$t"
sed -r -i -e 's/#,/COMMA/g' "$t"
cpp -P "$t" -o "$u" ; cp "$u" "$t"
python 'unicode_filter.py' "$t"
sed -r -i -e 's/ ?NEWLINE ?/\n/g' "$t"
sed -r -i -e 's/HASH/#/g' "$t"
sed -r -i -e 's/COMMA/,/g' "$t"
sed -r -i -e "s/QUOTE/'/g" "$t"
sed -r -i -e 's/;/`;/g' "$t"

cygpath_w "$TEMP"
slash_back "$r"
hstart64 //NOCONSOLE "AutoHotkey $r/global_keys.ahk"