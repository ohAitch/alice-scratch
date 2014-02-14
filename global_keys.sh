#!/bin/bash

function pause() { read -p 'Press [Enter] to continue . . .'; }

t=$TEMP/global_keys.ahk
u=$TEMP/global_keys.ahk.tmp

cp global_keys.ahk.c $t
sed -r -i -e 's/ ?#n ?/ NEWLINE /g' $t
sed -r -i -e 's/###/HASH/g' $t
sed -r -i -e 's/#,/COMMA/g' $t
cpp -P $t -o $u ; cp $u $t
python 'unicode_filter.py' $t
sed -r -i -e 's/ NEWLINE /\n/g' $t
sed -r -i -e 's/HASH/#/g' $t
sed -r -i -e 's/COMMA/,/g' $t
sed -r -i -e "s/QUOTE/'/g" $t
sed -r -i -e 's/;/`;/g' $t
cd /c/
hstart64 //NOCONSOLE "AutoHotkey ${WIN_TEMP:2}/global_keys.ahk"