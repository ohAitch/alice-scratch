#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"

rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,file/**/}.DS_STORE ) }
rm_bad_cache

cd ~/file/.archive/

cp ~/'Library/Application Support/Google/Chrome/Default/History' ".mirror/chrome History $(ζ 'Time().ym').db"
# cp ~/'Library/Application Support/Skype/alice0meta/main.db' ".mirror/skype alice0meta macbook $(ζ 'Time().ym').db"
tar -c ~/Library/Preferences | xz -v > ".mirror/Preferences $(ζ 'Time().ym').tar.xz"
tar -c ~/Library/Fonts > ".mirror/Fonts $(ζ 'Time().ym').tar"
tar -c ~/'Library/Application Support/Google/Chrome/Default/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects' | xz -v > ".mirror/#SharedObjects $(ζ 'Time().ym').tar.xz"
# tar --exclude ~/'Library/Application Support/Steam/' -c ~/'Library/Application Support' > ".mirror/Application Support $(ζ 'Time().ym').tar"

ls -AloR ~/file > "ls/$(ζ 'Time().ymdhms') ~%2Ffile"
ls -AloR ~/Downloads > "ls/$(ζ 'Time().ymdhms') ~%2FDownloads"

ls -Alo /Applications > "ls/$(ζ 'Time().ymdhms') %2FApplications"
ls -Alo /Applications/Utilities > "ls/$(ζ 'Time().ymdhms') %2FApplications%2FUtilities"
ls -Alo ~/Applications > "ls/$(ζ 'Time().ymdhms') ~%2FApplications"
{ echo '# brew leaves'; brew leaves; echo $'\n# brew cask list'; brew cask list; echo $'\n# npm -g ls'; npm -g ls --depth=0; } > "ls/$(ζ 'Time().ymdhms') package manager ls"

~/code/scratch/data_spotify/backup.ζ

brew update

t=~/file/.archive/defaults/"$(ζ 'Time().ymdhms')"; mkdir "$t"; IFS=', '; for x in $(defaults domains); do defaults export "$x" -> "$t"/"$x".plist; done
