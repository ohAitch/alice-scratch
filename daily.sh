#!/usr/bin/env bash
shopt -s globstar
rmds() { rm -f ~/.DS_STORE ~/Desktop/.DS_STORE ~/ali/**/.DS_STORE; }
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
date_month() { date -u +"%Y-%m"; }

######## history/auto ########

out=~/ali/history/auto/

cp ~/Library/Application\ Support/Google/Chrome/Default/Bookmarks "$out/bookmarks/$(date_i).json"
cp ~/Library/Application\ Support/Google/Chrome/Default/History "$out/chrome History $(date_month).db"
cp ~/Library/Spelling/LocalDictionary "$out/dictionary/$(date_i).txt"
cp ~/Library/Application\ Support/Skype/alice0meta/main.db "$out/skype zii-prime macbook $(date_month).db"
ls -AloR ~/ali > "$out/ls/$(date_i) ~:ali.txt"
ls -Alo /Applications > "$out/ls/$(date_i) :Applications.txt"
ls -Alo ~/Applications > "$out/ls/$(date_i) ~:Applications.txt"
ls -Alo ~/Applications/Chrome\ Apps > "$out/ls/$(date_i) ~:Applications:Chrome Apps.txt"
# cd ~/spotiman; ./backup.sh

############ other ###########

t=~/ali/misc/"non - ~:ali mirroring"
cp -r ~/.ssh "$t"
cp -r ~/.spotiman "$t"
cp ~/Library/Application\ Support/Sublime\ Text\ 3/Local/Session.sublime_session "$t"
cp ~/Library/Application\ Support/Sublime\ Text\ 3/Local/Auto\ Save\ Session.sublime_session "$t"

rmds
