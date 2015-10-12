#!/usr/bin/env bash
shopt -s globstar
rmds() { rm -f ~/{,Desktop,Downloads}/.DS_STORE ~/ali/**/.DS_STORE; }
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
date_month() { date -u +"%Y-%m"; }

rmds

out=~/ali/history/auto/

cp -a ~/.ssh ~/.spotiman ~/.gitconfig ~/.meteorsession ~/.npmrc \
	~/Library/Application\ Support/Sublime\ Text\ 3/Local/Session.sublime_session \
	~/Library/Application\ Support/Sublime\ Text\ 3/Local/Auto\ Save\ Session.sublime_session \
	"$out/#mirrors"
cp ~/Library/Application\ Support/Google/Chrome/Default/History "$out/#mirrors/chrome History $(date_month).db"
cp ~/Library/Application\ Support/Skype/alice0meta/main.db "$out/#mirrors/skype zii-prime macbook $(date_month).db"

cp ~/Library/Application\ Support/Google/Chrome/Default/Bookmarks "$out/bookmarks/$(date_i).json"

cp ~/Library/Spelling/LocalDictionary "$out/dictionary/$(date_i).txt"

ls -AloR ~/ali > "$out/ls/$(date_i) ~:ali.txt"
ls -Alo /Applications > "$out/ls/$(date_i) :Applications.txt"
ls -Alo ~/Applications > "$out/ls/$(date_i) ~:Applications.txt"
ls -Alo ~/Applications/Chrome\ Apps.localized > "$out/ls/$(date_i) ~:Applications:Chrome Apps.localized.txt"
echo $'# brew leaves\n'"$(brew leaves)"$'\n\n# brew cask list\n'"$(brew cask list)" > "$out/ls/$(date_i) brew ls.txt"

~/spotiman/backup.sh
