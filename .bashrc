shopt -s autocd
shopt -s globstar
shopt -s no_empty_cmd_completion
shopt -s histappend
HISTCONTROL=ignoredups
HISTSIZE=1000
HISTFILESIZE=2000

export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
# export mydir='t="${BASH_SOURCE[0]}"; while [ -h "$t" ]; do d="$(cd -P "$(dirname "$t")" && pwd)"; t="$(readlink "$t")"; [[ $t != /* ]] && t="$d/$t"; done; cd -P "$(dirname "$t")"'
pause() { read -p 'Press [Enter] to continue . . .'; }
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
ex() { chmod -R 755 "$1" &>/dev/null; }
exr() { ex "$1"; "$@"; }
this() { [ "$HOME" == "${PWD:0:${#HOME}}" ] && echo "~${PWD:${#HOME}}" || echo "$PWD"; }
export -f pause; export -f date_i; export -f ex; export -f exr; export -f this # should be deprecated

alias c='pbcopy'
alias p='pbpaste'
alias 64e='base64'
alias 64d='base64 --decode'
sb() { "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$@"; }
chrome() { open -a "Google Chrome.app" --args -disable-new-avatar-menu; }
alias tagtime='TTSETTINGS=~/ali/misc/settings.json tagtime'
alias opencp='sudo launchctl load /Library/LaunchDaemons/com.crashplan.engine.plist; /Applications/CrashPlan.app/Contents/MacOS/CrashPlan &'
alias killcp='sudo launchctl unload /Library/LaunchDaemons/com.crashplan.engine.plist'
f() { open "${1:-.}"; osascript -e 'tell application "Path Finder" to activate'; }
x() { [[ $? = 0 ]] && exit; }
b() { say -v Zarvox "beep"; }
ar() { tar -cf "${1%/}.tar" "$@"; xz -v "${1%/}.tar"; }
# ar_zip() { ditto -ckv --keepParent "$1" "${2%/}.zip"; }
rmds() { rm -f ~/.DS_STORE ~/ali/**/.DS_STORE; }
# beeg() { t=$(curl -X GET -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)"); echo "$t" | jq .roadall | sb & }
# beep() { curl -X PUT -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)&roadall=$(p)"; }
npmi() { mv package.json $(D npm_inc_tmp); cd npm_inc_tmp; npm version patch; mv package.json ..; cd ..; rmdir npm_inc_tmp; }
jz() { p | jsζ₂ | c; x; }
ζr() { ζ₂ -c "$1" .; exr "${1/.ζ₂/.js}" "${@:2}"; rm "${1/.ζ₂/.js}"; }
clear() { /usr/bin/clear && printf '\e[3J'; }
D() { [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
# RM() { [ -d "$1" ] || [ -f "$1" ] && rm -r "$1"; echo "$1"; }
# exists() { type "$1" &>/dev/null; }
alias l='ls -AG'
T() { tee /tmp/lastL; } #! should use mktemp
L() { cat /tmp/lastL; }
# mute() { osascript -e "set volume output muted $([[ $(osascript -e 'output muted of (get volume settings)') == 'true' ]] && echo false || echo true)"; }
mute() { osascript -e "set volume output muted true"; }
unmute() { osascript -e "set volume output muted false"; }
vol() { osascript -e "set volume output volume $1"; }
switch() { echo $(date_i) "$1" >> ~/ali/history/auto/switch.log; }
dot() { t=$(cat); tmp=$(mktemp /tmp/dot_XXXXXX); echo $'#!/usr/bin/env bash\nset -o xtrace\n'"$t" > $tmp; exr $tmp; rm $tmp; }
convertpng() { for t in "$@"; do convert "$t" "${t%.*}.png"; done; }

#! terrible PATH organization. should really put external things properly external.
export PATH="$PATH:$HOME/.rvm/bin"; [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # load RVM #! terrible place
export PATH="./node_modules/.bin:/usr/local/bin:$PATH:$(echo ~/go/bin):$(echo ~/Library/Haskell/bin):/Applications/Racket v6.1.1/bin:."
export GOPATH=~/go #! terrible place
export GITHUB_TOKEN=$(cat ~/.auth/github)

export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
export PS1='\[$([[ $? -eq 0 ]] && echo $green || echo $red)\]$(this) \[$reset\]'
cnfhcd=$(mktemp /tmp/cnfhcd_XXXXXX)
PROMPT_COMMAND='update_terminal_cwd; [ -s '"$cnfhcd"' ] && { cd $(cat '"$cnfhcd"'); rm '"$cnfhcd"'; } || true'

command_not_found_handle() {
	if [ "$1" = $ ]; then try=(run index main); else try=("$1"); fi
	while true; do
		t=($(for t in "${try[@]}"; do echo "$t $t.sh $t.ζ₂ $t.js $t.py"; done))
		t=($(for t in "${t[@]}"; do [ -f "$t" ] && echo "$t"; done))
		if [ "$t" != "" ]; then
			[ $changed ] && echo "$purple$(this)/$t$reset"
			echo "$PWD" > "$cnfhcd"
			exr "$t" "${@:2}"
		elif [ "$PWD" = / ]; then echo "$0: $1: command not found"; return 1
		else cd ..; changed=1; continue
		fi
	break; done
	}

export NVM_DIR="/Users/ali/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
export PYTHONPATH="/usr/local/lib/python2.7/site-packages" # what

# # Add an "alert" alias for long running commands.  Use like so:
# #   sleep 10; alert
# alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*a
# lert$//'\'')"'
