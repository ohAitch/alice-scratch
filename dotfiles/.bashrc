[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."

export PROMPT_COMMAND='_PC_t $? "$(history 1)"; hash -r'; export PS1=$'\[\e[90m\]>\[\e[0m\] '

###### for external use ######
ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; } # ζ
alias Z=ζ # ! temporary while terminal unicode is broken

eval "$(ζ ' require_new(φ`~/.bashrc.ζ`)._.pairs().map(([name,ι])=>{
	φpostrun ← "/tmp/postrun_"+random_id(9)
	↩ name+sh`(){
		ζ ${ι.cant_pool && "--fresh"} ${js` [process.env.?,process.shell_pid,…a] = a
			global.postrun = ι=> φ(${φpostrun}).text = ι
			require_new(φ("~/.bashrc.ζ"))[${name}](…a)
			`} $? $$ "$@"; E=$?
		[ -e ${φpostrun} ] && { eval -- "$(cat ${φpostrun})"; rm ${φpostrun}; }
		return $E; }` }).join("\n") ')"

# convert me to ζ
# it'll be easy and it'll be fun, getting all of the design right
# the key idea is “conf”
# right?

################### as for a prelude ### for interactive mode ##################
shopt -s no_empty_cmd_completion
alias -- -='cd ~-'
l(){ ls -AG "$@"; }
f(){ ζ ' go_to("path",a0) ;' "${1:-.}"; } # ported to ‡; remove
ar(){ tar -c "$@" | xz -v > "$(basename "$1").tar.xz"; } # another xz option is -9
…(){ eval "$(cat)"; }
_ag(){ local v="$1"; shift; &>/dev/null pushd "$v"; ag "$@" --ignore '*.min.*'; &>/dev/null popd; } # for /
/(){
	if [[ $1 = -H ]]; then _ag ~/file "$2" ./notes{,/.archive{,/.sublime}}
	elif [[ $1 = -h ]]; then _ag ~/file "$2" ./notes{,/.archive}
	else
		if man -- "$1" &> /tmp/man; then
			cat /tmp/man | col -bfx
		else
			rm -rf /tmp/sublime
			ζ ' φ`~/Library/Application Support/Sublime Text 3/Local/Auto Save Session.sublime_session`.json.windows[0].buffers.map(ι⇒ { name:ι.settings.name, ι:ι.contents }).filter(ι=> ι.name && ι.ι).map(({name,ι})=>{ φ`/tmp/sublime/${name}`.text = ι }) ;'
			_ag ~/file "$1" code{,/scratch{/dotfiles/{.keyrc,.bashrc{,.ζ}},/sublime/User/.sb-keyrc}} /tmp/sublime ~/.archive_* --ignore 'public/lib/'; _ag ~/file "$1" notes --ignore '#abandoned' --ignore '#auto' --ignore '#old stuff'
		fi
	fi | sb; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a 'Sublime Text.app' -f; else if [[ $# = 0 ]]; then ζ 'sb.tab.active.ι'; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
open_photoshop(){ open -a '/Applications/Adobe Photoshop CC 2015.5/Adobe Photoshop CC 2015.5.app' "$@"; }

################ personal configuration ### for interactive mode ###############

############# im_ ############
im_size(){ for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
im_to_png(){ for v in "$@"; do [[ $v = *.png ]] || { convert "$v" png:"${v%.*}.png" && rm "$v"; }; done; }
im_to_jpg(){ for v in "$@"; do [[ $v = *.jpg ]] || { convert "$v" jpg:"${v%.*}.jpg" && rm "$v"; }; done; }
# im_to_png(){ ζ ' a.map(ι=> ι.re`\.png$` || shᵥ`convert ${ι} png:${ι minus extension}.png && rm ${ι}`) ;' "$@"; }
im_to_grey(){ for v in "$@"; do convert "$v" -colorspace gray "$v"; done; }
im_concat(){
	local tile=$(ζ '!!ι.re`^(\d+x\d*|x\d+)$`' "$1" && { echo "$1"; shift; } || echo x1)
	local out="${@: -1}"; if ! [ -e "$out" ]; then set -- "${@:1:$(($#-1))}"; else while [ -e "$out" ]; do out="${out%.*}~.${out##*.}"; done; fi
	montage -mode concatenate -tile "$tile" "$@" "$out"; }
im_rotate_jpg(){ jpegtran -rotate 90 -outfile "$1" "$1"; }
ff_to_audio(){ ffmpeg -i file:"$1" -vn file:"${1%.*}".mp3; }
# ff_ogg_to_mp3(){ ffmpeg -i "$1" -codec:v copy -codec:a libmp3lame -q:a 2 ../q/"${1%.ogg}.mp3"; }
im_autowhite(){ ~/code/scratch/im_autowhite "$@"; }

comic_rotate(){
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
cache_imgurs(){ for v in "$@"; do local o=~/file/.cache/imgur/"$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/Downloads/"$2.%(ext)s" "$1"; }
youtube-dl-v(){ /usr/local/bin/youtube-dl -o ~/Downloads/"$2.%(ext)s" "$1"; }
ζlog(){ cat /usr/local/lib/node_modules/zeta-lang/log.txt; }
# cp_devi(){ rsync --protect-args --partial --progress --rsh=ssh 'alice@devi.xyz:/home/alice/'"$1" "$2"; }
# ls_devi(){ ssh alice@devi.xyz 'find . -not -path "*/\\.*" -type f' | sort; }
alias http-server='http-server -c-1'

############################## aborted experiments #############################
# alias ,='_home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
# cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then PWFdirty=0; builtin cd "${@:1:($#-1)}" "$(dirname "$v")"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; } # PWF(dirty) is not used elsewhere; it's an aborted experiment
