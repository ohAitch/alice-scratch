#!/bin/bash

function pause() { read -p 'Press [Enter] to continue . . .'; }

t=$TEMP/menu_key.ahk
u=$TEMP/menu_key.ahk.tmp

cp menu_key.ahk.c $t
sed -r -i -e 's/ ?#n ?/ NEWLINE /g' $t
sed -r -i -e 's/###/HASH/g' $t
sed -r -i -e 's/#,/COMMA/g' $t
cpp -P $t -o $u ; cp $u $t
sed -r -i -e 's/ NEWLINE /\n/g' $t
sed -r -i -e 's/HASH/#/g' $t
sed -r -i -e 's/COMMA/,/g' $t
python 'unicode_filter.py' $t
cd /c/
hstart64 //NOCONSOLE "AutoHotkey ${WIN_TEMP:2}/menu_key.ahk"