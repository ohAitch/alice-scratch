########### private ##########
shopt -s globstar
-q(){ "$@" &>/dev/null; }
is_term(){ osascript -e 'path to frontmost application' | -q grep Terminal.app; }
exp(){ a=$(stat -f "%p" "$1"); chmod +x "$1"; b=$(stat -f "%p" "$1"); [[ $a == $b ]] || echo "${purple}chmod +x \"$1\"$reset"; }
# bash_encode(){ sed "s/'/'\\\\''/g"; }
beep(){ local E=$?; [[ $1 != '' ]] && E="$1"; if [[ $E = 0 ]]; then afplay ~/ali/github/scratch/.bashrc/win.wav; else afplay ~/ali/github/scratch/.bashrc/error.wav; fi; return $E; }
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && echo "~${1:${#HOME}}" || echo "$1"; }
_chrome(){ local v=$(cat); /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$v"; osascript -e 'tell app "chrome" to activate'; }
_pastebin(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&api_paste_expire_date=N&api_dev_key=$(cat ~/.auth/pastebin)&" --data-urlencode "api_paste_code=$v" | sed -e 's/com\//com\/raw?i=/'; }

###### interactive only ######
shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=5000
export PS1='$(E=$?; echo \[$([[ $E = 0 ]] && echo $green || echo $red)\]$([[ $E = 0 || $E = 1 ]] || echo "$E. ")$(this)\[$reset\]" ")'
__rc_t1(){ if ! [[ $1 =~ [=] ]] && [ -f "$1" ] && ! [[ -x $1 ]]; then exp "$1"; fi; }; __rc_t2(){ __rc_t1 $BASH_COMMAND; }; trap __rc_t2 DEBUG

64e(){ base64; }
64d(){ base64 -D; }
p(){ if [ -t 0 ]; then pbpaste; else pbcopy; fi; }
sb(){ if [ -t 0 ]; then if [[ $# = 0 ]]; then echo 'r = view.substr(view.full_line(sublime.Region(0,view.size())))' | curl -s -X PUT 127.0.0.1:34289 --data-binary @- | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; else open -a "Sublime Text.app" -f; fi; }
opencp(){ sudo launchctl load /Library/LaunchDaemons/com.crashplan.engine.plist; /Applications/CrashPlan.app/Contents/MacOS/CrashPlan & }
killcp(){ sudo launchctl unload /Library/LaunchDaemons/com.crashplan.engine.plist; }
f(){ open -a 'Path Finder' "${1:-.}"; osascript -e 'tell app "Path Finder" to activate'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
clear(){ /usr/bin/clear && printf '\e[3J'; }
…(){ bash -s; }
alias pwf='echo "$(home_link "$PWD/$1")"'
alias ct=chrome_tabs; chrome_tabs(){
	local GET='t ← osaᵥ("tell app \"chrome\" \n get {title,URL} of tabs of windows \n end tell"); title ← t[0]; url ← t[1]'
	if [ -n "$1" ]; then ζ₂ -e "$GET"'; r ← title[0]['"$1"']+" "+url[0]['"$1"']; p(r); r'; echo '<copied>'
	else ζ₂ -e "$GET"'; _.zip(title,url).map(λ(ι){↩ _.zip.apply(_,ι)}).map(λ(ι){↩ ι.map(λ(ι){↩ ι.join(" ")}).join("\n")}).join("\n\n")' | sb
	fi; }
bookmarks(){ ζ₂ -e '(λ λ(v){↩ v instanceof Array? v.map(λ).join("\n") : v.children? (v.name+"\n"+v.children.map(λ).join("\n")).replace(/\n/g,"\n  ") : v.url === "http://transparent-favicon.info/favicon.ico"? v.name : v.url? (!v.name || v.url === v.name? v.url : v.name+" "+v.url) : JSON.stringify(v)})(JSON.parse(fs("'"${1:-~/Library/Application Support/Google/Chrome/Default/Bookmarks}"'").$).roots.bookmark_bar.children)' | sb; }
d(){ ( shopt -s nullglob; cd ${1:-.}; for t in .[!.] .??* * .; do du -hs "$t" 2>/dev/null | sed $'s/\t.*//' | tr '\n' '\t'; find "$t" 2>/dev/null | wc -l | tr '\n' '\t'; echo "$t"; done ) }
del(){ for v in "$@"; do v="$(realpath "$v")"; -q osascript -e 'tell app "finder" to delete POSIX file "'"$v"'"'; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ (-q qlmanage -p "$@" &); }
man(){ /usr/bin/man "$@" | col -bfx | sb; }
imgur(){
	local img=$(osascript -s s -e 'tell app "path finder" to set v to selection' -e 'item 1 of v' | ζ₂ -ef '"/"+ι.match(/(fsFolder|fsFile) "((\\"|.)*?)"/g).map(λ(ι){↩ ι.replace(/^\S+ "(.*)"$/,"$1")}).reverse().join("/")');
	local v="$(curl -sH "Authorization: Client-ID 3e7a4deb7ac67da" -F "image=@$img" "https://api.imgur.com/3/upload" | jq -r .data.link | googl)#imgur"; echo "$v" | p; echo "copied: $v"; }
im_to_png(){ for v in "$@"; do [[ $v == *.png ]] || { convert "$v" "${v%.*}.png" && rm "$v"; }; done; }
im_pdf_to_png() { for v in "$@"; do convert -verbose -density 150 -trim "$v" -quality 100 -sharpen 0x1.0 "${v%.*}.png"; done; }
im_resize(){ t="$1"; shift; for v in "$@"; do convert -scale "$t" "$v" "$v"; done; }
im_concat(){
	tile=$(echo "$1" | egrep -q '^(\d+x\d*|x\d+)$' && { echo "$1"; shift; } || echo x1)
	out="${@: -1}"; if ! [ -e "$out" ]; then set -- "${@:1:$(($#-1))}"; else while [ -e "$out" ]; do out="${out%.*}~.${out##*.}"; done; fi
	montage -mode concatenate -tile "$tile" "$@" "$out"; }
im_rotate_jpg(){ jpegtran -rotate "$1" -outfile "$2" "$2"; }
im_dateify(){
	echo=$([[ $1 = -d ]] && echo echo)
	for v in *.jpg; do t=$(identify -verbose "$v" | grep exif:DateTimeOriginal | sed -E 's/^ +[a-zA-Z:]+ //'); $echo mv "$v" "$(echo $t | awk '{ print $1 }' | tr : -)T$(echo $t | awk '{ print $2 }')Z.jpg"; done; }
im_grayscale(){ for v in "$@"; do convert "$v" -colorspace gray "$v"; done; }
im_size() { for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
l(){ ls -AG "$@"; }
lyrics(){ echo "https://www.google.com/search?q=lyrics $(osascript -e 'tell app "Spotify" to {artist,name} of current track')" | _chrome; }
comic_rotate(){
	mkdir \#rotated; for v in *; do if [[ $v != \#rotated ]]; then cp -r "$v" \#rotated; fi; done
	cd \#rotated; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
pb(){ local v="$(_pastebin | googl)#pastebin"; echo "$v" | _chrome; echo "$v" | p; echo "copied: $v"; }

alias grep='grep --exclude-dir node_modules'
alias egrep='egrep --exclude-dir node_modules'

### interactive & external ###
export PATH="./node_modules/.bin:/usr/local/bin:$HOME/ali/github/scratch:$PATH:."
export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
this(){ home_link "$PWD"; }
x(){ E=$?; if [[ $E = 0 ]]; then is_term || beep $E; exit; fi; is_term || { osascript -e 'tell app "terminal" to activate'; beep $E; }; return $E; }
rmds(){ rm -f ~/{,Desktop,Downloads}/.DS_STORE ~/ali/**/.DS_STORE; }
ζr(){ -q pushd $(dirname "$1"); ζ₂ -c "$1" .; -q popd; chmod +x "${1/.ζ₂/.js}"; "${1/.ζ₂/.js}" "${@:2}"; E=$?; rm "${1/.ζ₂/.js}"; return $E; }
↩(){
	local t=$(while :; do
		t=($(for t in {run,index,main}{,.sh,.ζ₂,.js,.py}; do [ -f "$t" ] && echo "$t"; done))
		[[ $t != "" ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo "$purple$(home_link "$t")$reset"; cd $(dirname "$t"); exp "$t"; "$t" "$@"; }; }

############# wat ############
export PYTHONPATH="/usr/local/lib/python2.7/site-packages"

#### system configuration ####
# -q which brew || ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # from http://brew.sh/
# # for v in /* ~/* ~/Library/LaunchAgents/*; do [ -h "$v" ] && printf "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# ln -sf ~/ali/github/scratch/.bashrc/.bashrc ~/ali/books ~/ali/github/scratch/spotiman ~
# ln -sf ~/books/\#papers ~/papers
# ln -sf ~/books/TheHourglassGrimoire/TheHourglassGrimoire.html ~/the-hourglass-grimoire
# ln -sf ~/ali/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# -q which realpath || { echo $'\e[41mrealpath not found\e[0m'; echo 'git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx'; echo $'\e[41m--------\e[0m'; }
# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE

############ bleh ############

# export PATH="$PATH:$HOME/.rvm/bin"; [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # load RVM #! terrible place
# export PATH="$PATH:$(echo ~/go/bin):$(echo ~/Library/Haskell/bin):/Applications/Racket v6.1.1/bin"
# export GOPATH=~/go #! terrible place
# export GITHUB_TOKEN=$(cat ~/.auth/github)
# export NVM_DIR="/Users/ali/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# alias tagtime='TTSETTINGS=~/ali/misc/settings.json tagtime'
# b(){ say -v Zarvox "beep"; }
# ar_zip(){ ditto -ckv --keepParent "$1" "${2%/}.zip"; }
# beeg(){ t=$(curl -X GET -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)"); echo "$t" | jq .roadall | sb & }
# beep(){ curl -X PUT -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)&roadall=$(p)"; }
# npmi(){ mv package.json $(D npm_inc_tmp); cd npm_inc_tmp; npm version patch; mv package.json ..; cd ..; rmdir npm_inc_tmp; }
# D(){ [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
# RM(){ [ -d "$1" ] || [ -f "$1" ] && rm -r "$1"; echo "$1"; }
# exists(){ type "$1" &>/dev/null; }
# T(){ tee /tmp/lastL; } #! should use mktemp
# L(){ cat /tmp/lastL; }
# mute(){ osascript -e "set volume output muted $([[ $(osascript -e 'output muted of (get volume settings)') == 'true' ]] && echo false || echo true)"; }
# mute(){ osascript -e "set volume output muted true"; }
# unmute(){ osascript -e "set volume output muted false"; }
# vol(){ osascript -e "set volume output volume $1"; }
# async(){ ( nohup bash -cl "$*" > ~/nohup.out & ) }
# cd $(dirname $(realpath "${BASH_SOURCE[0]}"))

# # Add an "alert" alias for long running commands.  Use like so:
# #   sleep 10; alert
# alias alert='notify-send --urgency=low -i "$([[ $? = 0 ]] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
# # here's a way to easily modify your macros key:
# { rm "$rc"; jq ".macros=$macros" > "$rc"; } < "$rc"
# # How to make the tagtime daemon automatically start on bootup in OSX:
# sudo ln -s /path/to/tagtimed.pl /Library/StartupItems/tagtimed.pl

# not
# for t in $(find . -type f); do echo $t; done
# instead
# find . -type f -print0 | while IFS= read -r -d $'\0' t; do echo $t; done
