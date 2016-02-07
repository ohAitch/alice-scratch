#!/usr/bin/env bash
rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,ali/**/}.DS_STORE ) }
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
date_month(){ date -u +"%Y-%m"; }

rm_bad_cache

cd ~/ali/history/auto/

cp -a ~/.ssh ~/.auth ~/.gitconfig ~/.meteorsession ~/.npmrc '#mirrors'
cp ~/'Library/Application Support/Google/Chrome/Default/History' "#mirrors/chrome History $(date_month).db"
cp ~/'Library/Application Support/Skype/alice0meta/main.db' "#mirrors/skype alice0meta macbook $(date_month).db"

cp ~/'Library/Application Support/Sublime Text 3/Local/Session.sublime_session'           "sublime/$(date_i) Session.sublime_session"
cp ~/'Library/Application Support/Sublime Text 3/Local/Auto Save Session.sublime_session' "sublime/$(date_i) Auto Save Session.sublime_session"

cp ~/'Library/Application Support/Google/Chrome/Default/Bookmarks' "bookmarks/$(date_i).json"

cp ~/Library/Spelling/LocalDictionary "dictionary/$(date_i).txt"

ls -AloR ~/ali > "ls/$(date_i) ~⟩ali"
ls -Alo ~/Downloads > "ls/$(date_i) ~⟩Downloads"

ls -Alo /Applications > "ls/$(date_i) ⟩Applications"
ls -Alo ~/Applications > "ls/$(date_i) ~⟩Applications"
ls -Alo ~/'Applications/Chrome Apps.localized' > "ls/$(date_i) ~⟩Applications⟩Chrome Apps.localized"
echo $'# brew leaves\n'"$(brew leaves)"$'\n\n# brew cask list\n'"$(brew cask list)"$'# npm -g ls\n'"$(npm -g ls | sed -E 's/^[│ ] [│├└ ].*//' | sed '/^$/d')" > "ls/$(date_i) package manager ls"

~/spotiman/backup.ζ
