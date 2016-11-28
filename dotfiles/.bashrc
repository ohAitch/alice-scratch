[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

export PROMPT_COMMAND='_PC_t $? "$(history 1)"; hash -r'; export PS1=$'\[\e[90m\]>\[\e[0m\] '

###### for external use ######
alias ·='eval -- "$(cat /tmp/__·)"; rm /tmp/__·;' # terminal_do_script
ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; } # ζ
clear(){ /usr/bin/clear && printf %s $'\e[3J'; }

eval "$(ζ ' require_new(φ`~/.bashrc.ζ`)._.keys().map(ι=> ι+sh`(){
	ζ ${"pb kp keypresses run run_project".split(" ")._.contains(ι)? "--fresh" : null} ${js`
		exit_parent ← ()=> φ("/tmp/exit_parent").text = ""
		process.env["?"] = a[0]
		require_new(φ("~/.bashrc.ζ"))[${ι}](…a.slice(1))
		`} $? "$@"; E=$?
	[ -e /tmp/exit_parent ] && { rm /tmp/exit_parent; exit; }
	return $E; }`).join("\n") ')"

################# should be system commands (interactive only) #################
shopt -s no_empty_cmd_completion
alias -- -='cd ~-'
l(){ ls -AG "$@"; }
f(){ open -a 'Path Finder' "${1:-.}"; ζ 'osaᵥ`path finder: activate`'; }
ar(){ tar -c "$@" | xz -v > "$(basename "$1").tar.xz"; }
…(){ eval "$(cat)"; }
man(){ /usr/bin/man "$@" > /tmp/man && { cat /tmp/man | col -bfx | sb; }; }
_ag(){ local v="$1"; shift; &>/dev/null pushd "$v"; ag "$@" --ignore '*.min.*'; &>/dev/null popd; } # for /
/(){
	if [[ $1 = -H ]]; then _ag ~/file "$2" ./notes{,/.history{,/.sublime}}
	elif [[ $1 = -h ]]; then _ag ~/file "$2" ./notes{,/.history}
	else _ag ~/code "$1" .{,/scratch{/dotfiles/{.keyrc,.bashrc{,.ζ}},/sublime/User/.sb-keyrc}} --ignore 'public/lib/'; _ag ~/file "$1" notes --ignore '#abandoned' --ignore '#auto' --ignore '#old stuff'
	fi | sb; }
alias ,='_home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then PWFdirty=0; builtin cd "${@:1:($#-1)}" "$(dirname "$v")"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; } # PWF(dirty) is not used elsewhere; it's an aborted experiment
rm_empty_dirs(){ find . -type d -empty -delete; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a 'Sublime Text.app' -f; else if [[ $# = 0 ]]; then printf %s 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }

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
cache_imgurs(){ for v in "$@"; do local o=~/file/history/.cache/imgur/"$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/Downloads/"$2.%(ext)s" "$1"; }
youtube-dl-v(){ /usr/local/bin/youtube-dl -o ~/Downloads/"$2.%(ext)s" "$1"; }
ζlog(){ cat /usr/local/lib/node_modules/zeta-lang/log.txt; }
cp_devi(){ rsync --protect-args --partial --progress --rsh=ssh 'alice@devi.xyz:/home/alice/'"$1" "$2"; }
ls_devi(){ ssh alice@devi.xyz 'find . -not -path "*/\\.*" -type f' | sort; }

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
