-q() { "$@" &>/dev/null; } # private
####### system checkup #######
-q which realpath || { echo $'\e[41mrealpath not found\e[0m'; echo 'git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx'; echo $'\e[41m--------\e[0m'; }

########### private ##########
shopt -s globstar
is_term() { osascript -e 'path to frontmost application' | grep Terminal.app >/dev/null; }
exp() { a=$(stat -f "%p" "$1"); chmod +x "$1"; b=$(stat -f "%p" "$1"); [[ $a == $b ]] || echo "${purple}chmod +x \"$1\"$reset"; }
bash_escape_() { sed "s/'/'\\\\''/g"; }

###### interactive only ######
shopt -s autocd; shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=5000
64e() { base64; }
64d() { base64 -D; }
p() { if [ -t 0 ]; then pbpaste; else pbcopy; fi; }
sb() { if [ -t 0 ]; then /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; else open -a "Sublime Text.app" -f; fi; }
opencp() { sudo launchctl load /Library/LaunchDaemons/com.crashplan.engine.plist; /Applications/CrashPlan.app/Contents/MacOS/CrashPlan & }
killcp() { sudo launchctl unload /Library/LaunchDaemons/com.crashplan.engine.plist; }
f() { open -a 'Path Finder' "${1:-.}"; osascript -e 'tell application "Path Finder" to activate'; }
ar() { tar -c "$@" | xz -v > "${1%/}.tar.xz"; }
clear() { /usr/bin/clear && printf '\e[3J'; }
# dot() { t=$(cat); tmp=$(mktemp /tmp/dot_XXXXXX); echo $'#!/usr/bin/env bash\nset -o xtrace\n'"$t" > $tmp; chmod +x $tmp; $tmp; rm $tmp; }
dot() { t=$(cat); tmp=$(mktemp /tmp/dot_XXXXXX); echo $'#!/usr/bin/env bash\n'"$t" > $tmp; chmod +x $tmp; $tmp; rm $tmp; }
alias pwf='echo "$(this)/$1"'
bookmarks() {
	if [[ $1 = t ]]; then ζ₂ -e 'ι ← osaᵥ("tell application \"chrome\"; get {URL,title} of tabs of windows; end tell"); _.zip(ι[0][0],ι[1][0]).map(λ(ι){↩ ι[1]+" "+ι[0]}).join("\n")' | sb
	else ζ₂ -e '(λ λ(v){↩ v instanceof Array? v.map(λ).join("\n") : v.children? (v.name+"\n"+v.children.map(λ).join("\n")).replace(/\n/g,"\n  ") : v.url === "http://transparent-favicon.info/favicon.ico"? v.name : v.url? (!v.name || v.url === v.name? v.url : v.name+" "+v.url) : JSON.stringify(v)})(JSON.parse(fs("'"${1:-~/Library/Application Support/Google/Chrome/Default/Bookmarks}"'").$).roots.bookmark_bar.children)' | sb
	fi; }
d() { ( shopt -s nullglob; for t in .[!.] .??* * .; do du -hs "$t" 2>/dev/null | sed $'s/\t.*//' | tr '\n' '\t'; find "$t" 2>/dev/null | wc -l | tr '\n' '\t'; echo "$t"; done ) }
del() { for v in "$@"; do v="$(realpath "$v")"; osascript -e 'tell application "finder" to delete POSIX file "'"$v"'"' >/dev/null; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql() { (-q qlmanage -p "$@" &); }

im_to_png() { for t in "$@"; do convert "$t" "${t%.*}.png"; done; }
im_resize() { t="$1"; shift; for v in "$@"; do convert -scale "$t" "$v" "$v"; done; }
im_concat() {
	tile="$1"; if [[ $tile = 1x || $tile = x1 ]]; then shift; else tile=x1; fi
	[ -e "${@: -1}" ] && { echo "won't overwrite" '"'"${@: -1}"'"'; return 1; }
	montage -mode concatenate -tile "$tile" "$@"; }
im_rotate_jpg() { jpegtran -rotate "$1" -outfile "$2" "$2"; }
im_date() { for v in "$@"; do printf "$v"; printf $'\t'; t=$(identify -verbose "$v" | grep exif:DateTimeOriginal | sed -E 's/^ +[a-zA-Z:]+ //'); echo "$(echo $t | awk '{ print $1 }' | tr : -)T$(echo $t | awk '{ print $2 }')Z"; done; }

export PS1='\[$([[ $? = 0 ]] && echo $green || echo $red)\]$([[ $__rc_exit = 0 || $__rc_exit = 1 ]] || echo "$__rc_exit. ")$(this)\[$reset\] '
command_not_found_handle() { t=0
	if [ "$1" = $ ]; then try=(run index main); else try=("$1"); fi
	while true; do
		t=($(for t in "${try[@]}"; do echo "$t $t.sh $t.ζ₂ $t.js $t.py"; done))
		t=($(for t in "${t[@]}"; do [ -f "$t" ] && echo "$t"; done))
		if [ "$t" != "" ]; then
			[ $changed ] && echo "$purple$(this)/$t$reset"
			echo "$PWD" > "$cnfh_cd"
			exp "$t"; "$t" "${@:2}"; t=$?
		elif [ "$PWD" = / ]; then echo "$0: $1: command not found"; return 1
		else cd ..; changed=1; continue
		fi
	break; done
	return $t; }
cnfh_cd=$(mktemp /tmp/cnfh_cd_XXXXXX)
PROMPT_COMMAND='__rc_exit=$?; update_terminal_cwd; [ -s '"$cnfh_cd"' ] && { cd $(cat '"$cnfh_cd"'); rm '"$cnfh_cd"'; } || true'
__rc_t1() { if ! [[ $1 =~ [=] ]] && [ -f "$1" ] && ! [[ -x $1 ]]; then exp "$1"; fi; }; __rc_t2() { __rc_t1 $BASH_COMMAND; }; trap __rc_t2 DEBUG

####### externally used ######
export PATH="./node_modules/.bin:/usr/local/bin:$PATH:."
export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
this() { [ "$HOME" == "${PWD:0:${#HOME}}" ] && echo "~${PWD:${#HOME}}" || echo "$PWD"; } #! this is weird.
x() { t=$?; if [[ $t = 0 ]]; then is_term || afplay ~/ali/github/scratch/.bashrc/win.wav; exit; fi; is_term || { osascript -e 'tell application "terminal" to activate'; afplay ~/ali/github/scratch/.bashrc/error.wav; }; return $t; }
rmds() { rm -f ~/{,Desktop,Downloads}/.DS_STORE ~/ali/**/.DS_STORE; }
ζr() { pushd $(dirname "$1") >/dev/null; ζ₂ -c "$1" .; popd >/dev/null; chmod +x "${1/.ζ₂/.js}"; "${1/.ζ₂/.js}" "${@:2}"; t=$?; rm "${1/.ζ₂/.js}"; return $t; }

####### prentice knows #######
chrome() { /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$@"; }
l() { ls -AG "$@"; }

############# wat ############
export PYTHONPATH="/usr/local/lib/python2.7/site-packages"

############ bleh ############

# export PATH="$PATH:$HOME/.rvm/bin"; [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # load RVM #! terrible place
# export PATH="$PATH:$(echo ~/go/bin):$(echo ~/Library/Haskell/bin):/Applications/Racket v6.1.1/bin"
# export GOPATH=~/go #! terrible place
# export GITHUB_TOKEN=$(cat ~/.auth/github)
# export NVM_DIR="/Users/ali/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# alias tagtime='TTSETTINGS=~/ali/misc/settings.json tagtime'
# b() { say -v Zarvox "beep"; }
# ar_zip() { ditto -ckv --keepParent "$1" "${2%/}.zip"; }
# beeg() { t=$(curl -X GET -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)"); echo "$t" | jq .roadall | sb & }
# beep() { curl -X PUT -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)&roadall=$(p)"; }
# npmi() { mv package.json $(D npm_inc_tmp); cd npm_inc_tmp; npm version patch; mv package.json ..; cd ..; rmdir npm_inc_tmp; }
# D() { [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
# RM() { [ -d "$1" ] || [ -f "$1" ] && rm -r "$1"; echo "$1"; }
# exists() { type "$1" &>/dev/null; }
# T() { tee /tmp/lastL; } #! should use mktemp
# L() { cat /tmp/lastL; }
# mute() { osascript -e "set volume output muted $([[ $(osascript -e 'output muted of (get volume settings)') == 'true' ]] && echo false || echo true)"; }
# mute() { osascript -e "set volume output muted true"; }
# unmute() { osascript -e "set volume output muted false"; }
# vol() { osascript -e "set volume output volume $1"; }
# async() { ( nohup bash -cl "$*" > ~/nohup.out & ) }
# cd $(dirname $(realpath "${BASH_SOURCE[0]}"))

# # Add an "alert" alias for long running commands.  Use like so:
# #   sleep 10; alert
# alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
# # here's a way to easily modify your macros key:
# { rm "$rc"; jq ".macros=$macros" > "$rc"; } < "$rc"
# # How to make the tagtime daemon automatically start on bootup in OSX:
# sudo ln -s /path/to/tagtimed.pl /Library/StartupItems/tagtimed.pl

# not
# for t in $(find . -type f); do echo $t; done
# instead
# find . -type f -print0 | while IFS= read -r -d $'\0' t; do echo $t; done
