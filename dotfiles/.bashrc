[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

export PROMPT_COMMAND='_PC_t $? "$(history 1)"; hash -r'; export PS1=$'\[\e[90m\]>\[\e[0m\] '

### for terminal_do_script ###
alias ·='eval -- "$(cat /tmp/__·)"; rm /tmp/__·;'

############ for ζ ###########
ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; }

######################### interactive & munge_stuff.py #########################
build.*(){
	# todo: run the current file if you can't find any build files? that would be ... unclean, gosh, but i want something here
	local t=$(while :; do
		t=($(shopt -s nullglob; echo {[b]uild{,.*},[p]ackage.json}))
		[[ $t != '' ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no buildable found"; return 1; } || {
		echo $'\e[35m'"$(_home_link "$t")"$'\e[0m'; cd "$(dirname "$t")"
		if [[ $(basename "$t") = package.json ]]; then
			if [[ $(jq .version package.json) != null ]]; then
				[[ $(jq .version package.json) = $(jq .version /usr/local/lib/node_modules/$(jq -r .name package.json)/package.json) ]] && npm --no-git-tag-version version patch
				npm -g i .
			else
				echo "package.json not buildable"; return 1
			fi
		else chmod +x "$t"; "$t" "$@"; fi
		}; }

################# should be system commands (interactive only) #################
shopt -s no_empty_cmd_completion
alias -- -='cd ~-'
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a 'Sublime Text.app' -f; else if [[ $# = 0 ]]; then printf %s 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
l(){ ls -AG "$@"; }
f(){ open -a 'Path Finder' "${1:-.}"; ζ 'osaᵥ`path finder: activate`'; }
ar(){ tar -c "$@" | xz -v > "$(basename "$1").tar.xz"; }
…(){ eval "$(cat)"; }
man(){ local t="$(/usr/bin/man "$@")"; [[ $? = 1 ]] || echo "$t" | col -bfx | sb; }
_ag(){ local v="$1"; shift; &>/dev/null pushd "$v"; ag "$@"; &>/dev/null popd; } # for /
/(){
	if [[ $1 = -H ]]; then _ag ~/file "$2" ./notes{,/.history{,/.sublime}}
	elif [[ $1 = -h ]]; then _ag ~/file "$2" ./notes{,/.history}
	else _ag ~/github "$1" .{,/scratch{/dotfiles/.{key,bash}rc,/sublime/User/.sb-keyrc}} --ignore 'public/lib/'; _ag ~/file "$1" notes --ignore '#abandoned' --ignore '#auto' --ignore '#old stuff'
	fi | sb; }
alias ,='_home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then PWFdirty=0; builtin cd "${@:1:($#-1)}" "$(dirname "$v")"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; } # PWF(dirty) is not used elsewhere; it's an aborted experiment
rm_empty_dirs(){ find . -type d -empty -delete; }

################## single-purpose commands (interactive only) ##################

### im_ (interactive only) ###
im_size() { for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
im_to_png(){ for v in "$@"; do [[ $v = *.png ]] || { convert "$v" png:"${v%.*}.png" && rm "$v"; }; done; }
# im_to_png(){ ζ ' a.map(ι=> /\.png$/.λ(ι) || shᵥ`convert ${ι} png:${ι minus extension}.png && rm ${ι}`) ;' "$@"; }
im_to_grey(){ for v in "$@"; do convert "$v" -colorspace gray "$v"; done; }
im_concat(){
	local tile=$(ζ '!!ι.re`^(\d+x\d*|x\d+)$`' "$1" && { echo "$1"; shift; } || echo x1)
	local out="${@: -1}"; if ! [ -e "$out" ]; then set -- "${@:1:$(($#-1))}"; else while [ -e "$out" ]; do out="${out%.*}~.${out##*.}"; done; fi
	montage -mode concatenate -tile "$tile" "$@" "$out"; }
im_rotate_jpg(){ jpegtran -rotate 90 -outfile "$1" "$1"; }
ff_to_audio(){ ffmpeg -i file:"$1" -vn file:"${1%.*}".mp3; }
# ff_ogg_to_mp3(){ ffmpeg -i "$1" -codec:v copy -codec:a libmp3lame -q:a 2 ../q/"${1%.ogg}.mp3"; }

comic_rotate(){
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
cache_imgurs(){ for v in "$@"; do local o=~/file/misc/.cache/imgur/"$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/Downloads/"$2.%(ext)s" "$1"; }
youtube-dl-v(){ /usr/local/bin/youtube-dl -o ~/Downloads/"$2.%(ext)s" "$1"; }
ζlog(){ cat /usr/local/lib/node_modules/zeta-lang/log.txt; }
cp_devi(){ rsync --protect-args --partial --progress --rsh=ssh 'alice@devi.xyz:/home/alice/'"$1" "$2"; }
ls_devi(){ ssh alice@devi.xyz 'find . -not -path "*/\\.*" -type f' | sort; }

################################### .bashrc.ζ ##################################
eval "$(ζ ' require_new(φ`~/.bashrc.ζ`)._.keys().map(ι=> ι+sh`(){
	ζλ ${"pb kp keypresses".split(" ")._.contains(ι)? "--fresh" : null} ${js`
		exit_parent ← ()=> φ("/tmp/exit_parent").text = ""
		process.env["?"] = a[0]
		require_new(φ("~/.bashrc.ζ"))[${ι}](…a.slice(1))
		`} $? "$@"; E=$?
	[ -e /tmp/exit_parent ] && { rm /tmp/exit_parent; exit; }
	return $E; }`).join("\n") ')"

############################# system configuration #############################
# &>/dev/null which brew || /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# &>/dev/null which realpath || { cd ~; git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx; }

# # for v in {/,~/,~/Library/LaunchAgents/}{.[^.],}*; do [ -h "$v" ] && printf %s "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# # ln -sf ~/file/github/scratch/{spotiman,bandcamp-dl,dotfiles/{.bashrc,.keyrc}} ~/file/consume/books ~
# ln -sf ~/file/github ~/file/github/scratch/dotfiles/{.bashrc{,.ζ},.keyrc} ~/file/consume/books ~
# # ln -sf ~/books/#papers ~/papers
# # ln -sf ~/books/#misc/page_cache ~/pg
# ln -sf ~/file/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# ln -sf ~/Library/Spelling/LocalDictionary ~/Library/'Application Support/Sublime Text 3'/Local ~/Library/'Application Support'/Google/Chrome/Default/Bookmarks ~/file/notes/#auto
# for v in ~/github/scratch/*; do [ -f "$v" ] && [ -x "$v" ] && ln -sf "$v" /usr/local/bin; done

# defaults write com.apple.finder AppleShowAllFiles YES
# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool false
# defaults write com.apple.loginwindow PowerButtonSleepsSystem -bool false
# defaults write com.apple.desktopservices DSDontWriteNetworkStores true
# duti -s com.sublimetext.3 public.plain-text all
# duti -s com.sublimetext.3 .md all

# restart_and_keep_alive(φ`~/file/github/scratch/log_fs_changes.ζ`+'')

# keys ← multiline(λ(){/*
# org.wesnoth.Wesnoth  Enter Full Screen  ⌘^f
# org.wesnoth.Wesnoth  Exit Full Screen   ⌘^f
# com.spotify.client  Full Screen    ⌘^f
# com.spotify.client  Go back        ⌘[
# com.spotify.client  Go forward     ⌘]
# com.spotify.client  Seek Backward  ⌘~←
# com.spotify.client  Seek Forward   ⌘~→
# com.google.Chrome  Developer Tools  ^`
# com.cocoatech.PathFinder  Select Next Tab      ^⇥
# com.cocoatech.PathFinder  Select Previous Tab  ^$⇥
# */})
# -
# encode_key ← ι=> '"'+ι.replace(/./g,ι=>0?0: {'⌘':'@','^':'^','⌥':'~','⇧':'$'}[ι]||ι ).replace(/./g,ι=>{ c ← ι.codePointAt(0); t←; ↩ c<0x80? ι : ( t = c.toString(16), t.length===4? '\\U'+t : ‽ ) })+'"'
# -
# keys.split('\n').map(ι=>{ t ← ι.split(/ {2,}/g); shᵥ`defaults write ${[t[0],'NSUserKeyEquivalents','-dict-add',t[1],encode_key(t[2])]}` })
# -
# // questions: does this work over reboot
# // test protocol: reboot, see if this worked
# // (shᵥ`last reboot`+'').split('\n')[0]
# // is it later than 2016-11-19? can you use path finder navigation? then it worked

################################### discarded ##################################
# shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=10000
# 64e(){ base64; }
# 64d(){ base64 -D; }
# ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
# del(){ for v in "$@"; do v="$(realpath "$v")"; ζ 'osaᵥ`finder: delete POSIX file ${ι}`;' "$v"; rm -f "$(dirname "$v")/.DS_STORE"; done; }
# ql(){ ( &>/dev/null qlmanage -p "$@" &); }
# im_pdf_to_png__bad() { for v in "$@"; do convert -verbose -density 150 -trim "$v" -quality 100 -sharpen 0x1.0 png:"${v%.*}.png"; done; }
# ff_crop(){ ffmpeg -i file:"$1" -ss "$2" -t "$3" -async 1 file:"${1%.*} cut".mp4; }
# rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,file/**/}.DS_STORE ); sudo find /private/var/folders -name com.apple.dock.iconcache -exec rm {} \;; }
# kc(){ sudo killall coreaudiod; }
