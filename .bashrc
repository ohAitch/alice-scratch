shopt -s autocd
shopt -s globstar
shopt -s no_empty_cmd_completion

pause() { read -p 'Press [Enter] to continue . . .'; }; export -f pause
export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
# export mydir='t="${BASH_SOURCE[0]}"; while [ -h "$t" ]; do d="$(cd -P "$(dirname "$t")" && pwd)"; t="$(readlink "$t")"; [[ $t != /* ]] && t="$d/$t"; done; cd -P "$(dirname "$t")"'
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }; export -f date_i
ex() { chmod -R 755 "$1" &>/dev/null; }; export -f ex
exr() { ex "$1"; "$@"; }; export -f exr
mk() { cat >"$1"; chmod -R 755 "$1" &>/dev/null; }; export -f mk
this() { [ "$HOME" == "$PWD" ] && echo "~" || [ "$HOME" == "${PWD:0:${#HOME}}" ] && echo "~${PWD:${#HOME}}" || echo "$PWD"; }; export -f this
D() { [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
# RM() { [ -d "$1" ] || [ -f "$1" ] && rm -r "$1"; echo "$1"; }
# exists() { type "$1" &>/dev/null; }
clear() { /usr/bin/clear && printf '\e[3J'; }

alias E='echo'
alias c='pbcopy'
alias p='pbpaste'
alias 64e='base64'
alias 64d='base64 --decode'
sb() { "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$@"; }
alias chrome='"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
alias tagtime='TTSETTINGS=~/ali/misc/settings.json tagtime'
f() { open "${1:-.}"; osascript -e 'tell application "Path Finder" to activate'; }
x() { [[ $? = 0 ]] && exit; }
b() { say -v Zarvox "beep"; }
ar() { tar -cf "${1%/}.tar" "$@"; xz -v "${1%/}.tar"; }
# ar_zip() { ditto -ckv --keepParent "$1" "${2%/}.zip"; }
rmds() { rm -f ~/.DS_STORE ~/ali/**/.DS_STORE; }
beeg() { curl -X GET -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)" | jq .roadall | sb; }
beep() { curl -X PUT -g "https://www.beeminder.com/api/v1/users/me/goals/$1.json?auth_token=$(cat ~/.auth/beeminder)&roadall=$(p)"; }
npmi() { mv package.json $(D npm_inc_tmp); cd npm_inc_tmp; npm version patch; mv package.json ..; cd ..; rmdir npm_inc_tmp; }
jz() { p | jsζ₂ | c; x; }

export PATH="$PATH:$HOME/.rvm/bin"; [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # load RVM #! terrible place
export PATH="./node_modules/.bin:/usr/local/bin:$PATH:$(E ~/go/bin):$(E ~/Library/Haskell/bin):."
export GOPATH=~/go #! terrible place
export GITHUB_TOKEN=$(cat ~/.auth/github)

export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
export PS1='\[$([[ $? -eq 0 ]] && echo $green || echo $red)\]$(this) \[$reset\]'
PROMPT_COMMAND='update_terminal_cwd; [ -s /tmp/cnfhcd ] && { cd $(cat /tmp/cnfhcd); rm /tmp/cnfhcd; } || true'

command_not_found_handle() {
	if [ "$1" = $ ]; then try=("$1" \$ run main build deploy publish); else try=("$1"); fi
	while true; do
		t=($(for t in "${try[@]}"; do echo "$t $t.sh $t.*"; done))
		t=($(for t in "${t[@]}"; do [ -f "$t" ] && echo "$t"; done))
		if [ "$t" != "" ]; then
			[ $changed ] && echo "$purple$(this)/$t$reset"
			echo "$PWD" > /tmp/cnfhcd
			exr "$t" "${@:2}"
		elif [ "$PWD" = / ]; then echo "$0: $1: command not found"; return 1
		else cd ..; changed=1; continue
		fi
	break; done
	}
