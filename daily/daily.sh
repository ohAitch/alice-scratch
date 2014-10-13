#!/usr/bin/env bash
source ~/.bashrc
#eval $mydir

#-------- history/auto --------

cp ~/"Library/Application Support/Google/Chrome/Default/Bookmarks" ~/ali/history/auto/bookmarks/$(date_i).json

cp ~/Library/Spelling/LocalDictionary ~/ali/history/auto/dictionary/$(date_i).txt

ls -Alo  /Applications > ~/"ali/history/auto/ls/$(date_i) :Applications.txt"
ls -AloR ~/ali         > ~/"ali/history/auto/ls/$(date_i) ~:ali.txt"
# ls -AloR ~/Desktop     > ~/"ali/history/auto/ls/$(date_i) ~:Desktop.txt"
# ls -AloR ~/Downloads   > ~/"ali/history/auto/ls/$(date_i) ~:Downloads.txt"

# cd ~/ali/github/scratch/spotiman; main.sh backup

#------------ other -----------

shopt -s globstar
rm ~/ali/**/.DS_STORE

t=~/ali/misc/"non - ~:ali mirroring"
cp ~/.gitconfig "$t"
cp ~/.meteorsession "$t"
cp ~/.npmrc "$t"
cp -r ~/.ssh "$t"
cp ~/"Library/Application Support/Sublime Text 3/Local/Auto Save Session.sublime_session" "$t"
cp ~/"Library/Application Support/Sublime Text 3/Local/Session.sublime_session" "$t"
