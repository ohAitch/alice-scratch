__dirname=$(dirname $(realpath "${BASH_SOURCE[0]}"))
########### private ##########
shopt -s globstar
-q(){ "$@" &>/dev/null; }
is_term(){ osascript -e 'path to frontmost application' | -q grep Terminal.app; }
exp(){ a=$(stat -f "%p" "$1"); chmod +x "$1"; b=$(stat -f "%p" "$1"); [[ $a == $b ]] || echo "${purple}chmod +x \"$1\"$reset"; }
beep(){ local E=$?; [[ $1 != '' ]] && E="$1"; afplay $([[ $E = 0 ]] && echo "$__dirname/win.wav" || echo "$__dirname/error.wav"); return $E; }
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && echo "~${1:${#HOME}}" || echo "$1"; }
_chrome(){ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$1"; osascript -e 'tell app "chrome" to activate'; }
_pastebin(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&$(cat ~/.auth/pastebin)" --data-urlencode "api_paste_code=$v" | sed -e 's/com\//com\/raw?i=/'; }
_encodeURIComponent(){ ζ₂ -ef 'ι = ι.replace(/\n$/,""); encodeURIComponent(ι)'; }

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
f(){ open -a 'Path Finder' "${1:-.}"; osascript -e 'tell app "path finder" to activate'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
clear(){ /usr/bin/clear && printf '\e[3J'; }
…(){ bash -s; }
alias pwf='echo "$(home_link "$PWD/$1")"'
alias ct=chrome_tabs; chrome_tabs(){ ζ₂ -e '
	t ← osaᵥ("tell app \"chrome\" \n get {title,URL} of tabs of windows \n end tell"); title ← t[0]; url ← t[1]
	i ← '"$(echo "$1" | jq -R .)"'
	if (i) {i = parseInt(i); t ← title[0][i]+" "+url[0][i]; p(t); print(t+"\n<copied>")}
	else sb(_.zip(title,url).map(λ(ι){↩ _.zip.apply(_,ι)}).map(λ(ι){↩ ι.map(λ(ι){↩ ι.join(" ")}).join("\n")}).join("\n\n"))
	undefined'; }
bookmarks(){ ζ₂ -e '
	ι ← JSON.parse(fs("'"${1:-~/Library/Application Support/Google/Chrome/Default/Bookmarks}"'").$).roots.bookmark_bar.children
	;(λ λ(ι){↩ ι instanceof Array? ι.map(λ).join("\n") :
		ι.children? (ι.name+"\n"+ι.children.map(λ).join("\n")).replace(/\n/g,"\n  ") :
		ι.url === "http://transparent-favicon.info/favicon.ico"? ι.name :
		ι.url? (!ι.name || ι.url === ι.name? ι.url : ι.name+" "+ι.url) :
			JSON.stringify(ι)})(ι)' | sb; }
d(){ ( shopt -s nullglob; cd ${1:-.}; for t in .[!.] .??* * .; do du -hs "$t" 2>/dev/null | sed $'s/\t.*//' | tr '\n' '\t'; find "$t" 2>/dev/null | wc -l | tr '\n' '\t'; echo "$t"; done ) }
del(){ for v in "$@"; do v="$(realpath "$v")"; -q osascript -e 'tell app "finder" to delete POSIX file "'"$v"'"'; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ (-q qlmanage -p "$@" &); }
man(){ /usr/bin/man "$@" | col -bfx | sb; }
imgur(){
	local img=$(osascript -ss -e 'tell app "path finder" to set v to selection' -e 'item 1 of v' | ζ₂ -ef '"/"+ι.match(/(fsFolder|fsFile) "((\\"|.)*?)"/g).map(λ(ι){↩ ι.replace(/^\S+ "(.*)"$/,"$1")}).reverse().join("/")');
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
comic_rotate(){
	mkdir \#rotated; for v in *; do if [[ $v != \#rotated ]]; then cp -r "$v" \#rotated; fi; done
	cd \#rotated; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
pb(){ local v="$(_pastebin | googl)#pastebin"; _chrome "$v"; echo "$v" | tr -d '\n' | p; echo "copied: $v"; }

alias grep='grep --exclude-dir node_modules'
alias egrep='egrep --exclude-dir node_modules'

### interactive & external ###
export PATH="./node_modules/.bin:/usr/local/bin:$HOME/ali/github/scratch:$PATH:."
export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
this(){ home_link "$PWD"; }
x(){ E=$?; if [[ $E = 0 ]]; then is_term || beep $E; exit; fi; is_term || { osascript -e 'tell app "terminal" to activate'; beep $E; }; return $E; }
rmds(){ rm -f ~/{,Desktop,Downloads}/.DS_STORE ~/ali/**/.DS_STORE; }
↩(){
	local t=$(while :; do
		t=($(for t in {run,index,main}{,.sh,.ζ₂,.js,.py}; do [ -f "$t" ] && echo "$t"; done))
		[[ $t != "" ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo "$purple$(home_link "$t")$reset"; cd $(dirname "$t"); exp "$t"; "$t" "$@"; }; }

######## external only #######
alert(){ osascript -ss -e 'tell app "system events" to display alert "'"$1"'"'"$([ -n "$2" ] && echo ' message "'"$2"'"')$([ -n "$3" ] && echo ' giving up after "'"$3"'"')"; }
](){ [[ $1 = ⌘q ]] || { alert "could not p"; exit 1; }; osascript -e 'tell app "system events" to keystroke "q" using command down'; }
_lyrics(){ _chrome "https://www.google.com/search?q=lyrics $(osascript -e 'tell app "Spotify" to {artist,name} of current track' | _encodeURIComponent)"; }
_in_new_terminal(){ local t=("$@"); osascript -e 'tell app "terminal" to do script '"$(printf "$(IFS=$'\n' ; echo "${t[*]}")" | ζ₂ -ef 'osa_encode((ι).split("\n").map(bash_encode.X(1)).join(" ")+" &>/dev/null; exit")')"; }

############# wat ############
export PYTHONPATH="/usr/local/lib/python2.7/site-packages"

#### system configuration ####
# -q which brew || ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # from http://brew.sh/
# # for v in /* ~/* ~/Library/LaunchAgents/*; do [ -h "$v" ] && printf "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# ln -sf ~/ali/github/scratch/{spotiman,dotfiles/{.bashrc,.keyrc}} ~/ali/books ~
# ln -sf ~/books/\#papers ~/papers
# ln -sf ~/books/TheHourglassGrimoire/TheHourglassGrimoire.html ~/the-hourglass-grimoire
# ln -sf ~/ali/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# -q which realpath || { echo $'\e[41mrealpath not found\e[0m'; echo 'git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx'; echo $'\e[41m--------\e[0m'; }
# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool false
# defaults write com.apple.loginwindow PowerButtonSleepsSystem -bool false

######### deprecated #########
# ar_zip(){ ditto -ckv --keepParent "$1" "${2%/}.zip"; }
# D(){ [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
# RM(){ [ -d "$1" ] || [ -f "$1" ] && rm -r "$1"; echo "$1"; }
# exists(){ -q type "$1"; }
# T(){ tee /tmp/lastL; } #! should use mktemp
# L(){ cat /tmp/lastL; }
# mute(){ osascript -e "set volume output muted $([[ $(osascript -e 'output muted of (get volume settings)') == 'true' ]] && echo false || echo true)"; }
# mute(){ osascript -e "set volume output muted true"; }
# unmute(){ osascript -e "set volume output muted false"; }
# vol(){ osascript -e "set volume output volume $1"; }
# async(){ ( nohup bash -cl "$*" > ~/nohup.out & ) }
# here's a way to easily modify your macros key: { rm "$rc"; jq ".macros=$macros" > "$rc"; } < "$rc"
# How to make the tagtime daemon automatically start on bootup in OSX: sudo ln -s /path/to/tagtimed.pl /Library/StartupItems/tagtimed.pl
# not [for t in $(find . -type f); do echo $t; done], instead [find . -type f -print0 | while IFS= read -r -d $'\0' t; do echo $t; done]
