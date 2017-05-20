#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"

rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,file/**/}.DS_STORE ) }
rm_bad_cache

cd ~/file/history/auto/

cp ~/'Library/Application Support/Google/Chrome/Default/History' "#mirrors/chrome History $(ζ 'Time().ym ').db"
cp ~/'Library/Application Support/Skype/alice0meta/main.db' "#mirrors/skype alice0meta macbook $(ζ 'Time().ym ').db"
tar -c ~/Library/Preferences | xz -v > "#mirrors/Preferences $(ζ 'Time().ym ').tar.xz"
tar -c ~/Library/Fonts > "#mirrors/Fonts $(ζ 'Time().ym ').tar"
tar -c ~/'Library/Application Support/Google/Chrome/Default/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects' | xz -v > "#mirrors/#SharedObjects $(ζ 'Time().ym ').tar.xz"
tar --exclude ~/'Library/Application Support/Steam/' -c ~/'Library/Application Support' > "#mirrors/Application Support $(ζ 'Time().ym ').tar"

ls -AloR ~/file > "ls/$(ζ 'Time().ymdhms ') ~%2Ffile"
ls -AloR ~/Downloads > "ls/$(ζ 'Time().ymdhms ') ~%2FDownloads"

ls -Alo /Applications > "ls/$(ζ 'Time().ymdhms ') %2FApplications"
ls -Alo /Applications/Utilities > "ls/$(ζ 'Time().ymdhms ') %2FApplications%2FUtilities"
ls -Alo ~/Applications > "ls/$(ζ 'Time().ymdhms ') ~%2FApplications"
{ echo '# brew leaves'; brew leaves; echo $'\n# brew cask list'; brew cask list; echo $'\n# npm -g ls'; npm -g ls --depth=0; } > "ls/$(ζ 'Time().ymdhms ') package manager ls"

~/code/scratch/spotiman/backup.ζ

brew update
