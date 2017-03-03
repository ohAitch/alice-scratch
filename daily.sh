#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,file/**/}.DS_STORE ) }
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
date_month(){ date -u +"%Y-%m"; }

rm_bad_cache

cd ~/file/history/auto/

cp -a ~/.ssh ~/.auth ~/.gitconfig ~/.npmrc '#mirrors'
cp ~/'Library/Application Support/Google/Chrome/Default/History' "#mirrors/chrome History $(date_month).db"
cp ~/'Library/Application Support/Skype/alice0meta/main.db' "#mirrors/skype alice0meta macbook $(date_month).db"
tar -c ~/Library/Preferences | xz -v > "#mirrors/Preferences $(date_month).tar.xz"
tar -c ~/Library/Fonts > "#mirrors/Fonts $(date_month).tar"
tar -c ~/'Library/Application Support/Google/Chrome/Default/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects' | xz -v > "#mirrors/#SharedObjects $(date_month).tar.xz"
tar --exclude ~/'Library/Application Support/Steam/' -c ~/'Library/Application Support' > "#mirrors/Application Support $(date_month).tar"

ls -AloR ~/file > "ls/$(date_i) ~%2Ffile"
ls -AloR ~/Downloads > "ls/$(date_i) ~%2FDownloads"

ls -Alo /Applications > "ls/$(date_i) %2FApplications"
ls -Alo /Applications/Utilities > "ls/$(date_i) %2FApplications%2FUtilities"
ls -Alo ~/Applications > "ls/$(date_i) ~%2FApplications"
{ echo '# brew leaves'; brew leaves; echo $'\n# brew cask list'; brew cask list; echo $'\n# npm -g ls'; npm -g ls --depth=0; } > "ls/$(date_i) package manager ls"

~/code/scratch/spotiman/backup.ζ

brew update
