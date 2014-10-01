#!/usr/bin/env bash
source ~/.bashrc
#eval $mydir
shopt -s globstar

#-------- history/auto --------

#chrome="$USERPROFILE/AppData/Local/Google/Chrome/User Data" #windows
chrome=~/"Library/Application Support/Google/Chrome" #osx
cp "$chrome/Default/Bookmarks" ~/ali/history/auto/bookmarks/$(date_i).json

cp ~/Library/Spelling/LocalDictionary ~/ali/history/auto/dictionary/$(date_i).txt

ls -Alo  /Applications > ~/"ali/history/auto/ls/$(date_i) :Applications.txt"
ls -AloR ~/ali         > ~/"ali/history/auto/ls/$(date_i) ~:ali.txt"
ls -AloR ~/Desktop     > ~/"ali/history/auto/ls/$(date_i) ~:Desktop.txt"
ls -AloR ~/Downloads   > ~/"ali/history/auto/ls/$(date_i) ~:Downloads.txt"

# cd ~/ali/github/scratch/spotiman; main.sh backup

#------------ other -----------

rm ~/ali/**/.DS_STORE

cp ~/.gitconfig ~/ali/misc/data
cp ~/.meteorsession ~/ali/misc/data
cp ~/.npmrc ~/ali/misc/data

cd ~/ali; git commit -a -m "automated"; true
