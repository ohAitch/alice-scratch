#!/bin/bash
eval $mydir

t="bin/ahk.ahk"
u="bin/temp"

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
sed -r -i -e 's/ ?NEWLINE ?/\n/g' "$t"
sed -r -i -e 's/HASH/#/g' "$t"
sed -r -i -e 's/COMMA/,/g' "$t"
sed -r -i -e 's/BSEMICOLON/`;/g' "$t"
sed -r -i -e 's/SEMICOLON/;/g' "$t"
sed -r -i -e "s/QUOTE/'/g" "$t"
sed -r -i -e 's/\\\\/\\/g' "$t"
python 'unicode_filter.py' "$t"

#! should probably be bash
hstart64 //NOCONSOLE "AutoHotkey bin/ahk.ahk"