#!/bin/bash

pause() { read -p 'Press [Enter] to continue . . .'; }

cp "$USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Bookmarks" "$ALI/history/bookmarks/`date \"+%Y-%m-%d %H.%M\"`"

cd $ALI
git add -A .; git commit -m "automated"