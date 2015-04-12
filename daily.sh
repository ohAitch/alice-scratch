#!/usr/bin/env bash
. ~/.bashrc
shopt -s globstar
rmds() { rm -f ~/.DS_STORE ~/ali/**/.DS_STORE; }

######## history/auto ########

cp ~/"Library/Application Support/Google/Chrome/Default/Bookmarks" ~/ali/history/auto/bookmarks/$(date_i).json
# : make nice pretty bookmarks listing; ζ₂ -e 'copy((λ λ(v){↩ v instanceof Array? v.map(λ).join("\n") : v.children? (v.name+"\n"+v.children.map(λ).join("\n")).replace(/\n/g,"\n  ") : v.url === "http://transparent-favicon.info/favicon.ico"? v.name : v.url? (!v.name || v.url === v.name? v.url : v.name+" "+v.url) : JSON.stringify(v)})(JSON.parse(fs("~/Library/Application Support/Google/Chrome/Default/Bookmarks").$).roots.bookmark_bar.children))'

cp ~/Library/Spelling/LocalDictionary ~/ali/history/auto/dictionary/$(date_i).txt

ls -Alo  /Applications > ~/"ali/history/auto/ls/$(date_i) :Applications.txt"
ls -AloR ~/ali         > ~/"ali/history/auto/ls/$(date_i) ~:ali.txt"
# ls -AloR ~/Desktop     > ~/"ali/history/auto/ls/$(date_i) ~:Desktop.txt"
# ls -AloR ~/Downloads   > ~/"ali/history/auto/ls/$(date_i) ~:Downloads.txt"

############ other ###########

t=~/ali/misc/"non - ~:ali mirroring"
cp -r ~/.ssh "$t"
cp ~/"Library/Application Support/Sublime Text 3/Local/Auto Save Session.sublime_session" "$t"
cp ~/"Library/Application Support/Sublime Text 3/Local/Session.sublime_session" "$t"

rmds

# also history/auto
cd ~/ali/github/scratch/spotiman; ./backup.sh
