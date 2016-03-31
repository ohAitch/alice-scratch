__dirname="$(dirname $(/usr/local/bin/realpath "${BASH_SOURCE[0]}"))"
#################################### private ###################################
λ(){ local c="$1"; shift; for v; do v="${v//\\/\\\\}"; printf -- "${v//↩/\\\\q}↩"; done | ζ -e 'ι = ι.replace(/↩$/,"").split("↩").map(ι => ι.replace(/\\./g,ι => ι==="\\\\"? "\\" : "↩")); '"$c"; }
-q(){ "$@" &>/dev/null; }
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && echo "~${1:${#HOME}}" || echo "$1"; } # should instead be a function that compresses all of the standard symlinks
_chrome(){ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$([[ $1 =~ ^https?:// ]] && echo "$1" || echo "https://www.google.com/search?q=$(echo "$1" | ζ -p 'encodeURIComponent(ι)')")"; osascript -e 'tell app "chrome" to activate'; }
_alert(){ λ ' osaᵥ`system events: display alert ${ι[0]} …${ι[1] && osa`message ${ι[1]}`} …${ι[2] && osa`giving up after ${ι[2]}`}` ' "$@"; }
####### single-purpose #######
_pastebin_id(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&$(cat ~/.auth/pastebin)" --data-urlencode "api_paste_code=$v" | sed -e 's/.*com\///'; } # pb
# _pastebin(){ local v=$(cat); c=--$'BtJctBOZ9e8RBV3JgbU\nContent-Disposition: form-data; name='; echo "http://pastebin.com/raw$(curl -s -D - 'http://pastebin.com/post.php' -H 'Content-Type: multipart/form-data; boundary=BtJctBOZ9e8RBV3JgbU' --data-binary "$c"$'"csrf_token"\n\nMTQ1MDQwNDA0NHZscEhXME9Scm12Q2l2V0ZPVFdqaGFLcWxQeXRZN3lS\n'"$c"$'"submit_hidden"\n\nsubmit_hidden\n'"$c"$'"paste_code"\n\n'"$v"$'\n'"$c"$'"paste_private"\n\n1\n--'$'BtJctBOZ9e8RBV3JgbU\n' | grep location | sed -e 's/location: //')"; }
chmodxprint(){ local a=$(stat -f "%p" "$1"); chmod +x "$1"; local b=$(stat -f "%p" "$1"); [[ $a == $b ]] || echo "${purple}chmod +x \"$1\"$reset"; } # ↩
set_term_title(){ printf "\033]0;%s\007" "$1"; } # x
this_term_is_frontmost(){ set_term_title __sentinel_f; local r=$(ζ -p 'osaᵥ`terminal: frontmost of (windows whose custom title = "__sentinel_f")`[0]'); set_term_title ''; [[ $r = true ]]; } # x
clear(){ /usr/bin/clear && printf '\e[3J'; } # sublime open terminal

################################ not interactive ###############################
beep(){ (afplay "$__dirname/$([[ $1 = 1 ]] && echo "fail.wav" || echo "done.wav")" &); }
ack(){ (afplay "$__dirname/ack.wav" &); }
nack(){ (afplay "$__dirname/nack.wav" &); }

################################## .keyrc only #################################
](){ λ 'ι = ι.join(" "); 
	// you can also use `key code`s, which are the same as the ones specified in `[keycode]` !
	ι = ι.split(/ +] +/g).map(ι =>
		(t=ι.re`^FnF(.)$`)? "key code "+[,107,113][t[1]]||(λ(){throw Error()})() :
		(t={"↩":36}[ι])? "key code "+t :
			osa`keystroke ${ι.replace(/^⌘/,"")}`+(ι.re`^⌘`? " using command down" : "")
		).join("\n")
	osaᵥ`system events: …${ι}`
	' "$@"; }
_in_new_terminal(){ echo "{ $1; } &>/dev/null; exit" > /tmp/__·; osascript -e 'tell app "terminal" to do script "·"'; }
alias _clr='cd ~; /usr/bin/clear && printf "\e[3J";'

################################# external only ################################
alias ·='eval -- "$(cat /tmp/__·)"; rm /tmp/__·;'

############################ interactive & external ############################
export PATH="./node_modules/.bin:/usr/local/bin:$HOME/ali/github/scratch:$PATH:."
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
x(){ local E=$?; this_term_is_frontmost || { [[ $E != 0 ]] && ζ -e 'osaᵥ`terminal: activate`'; beep $E; }; [[ $E = 0 ]] && exit; return $E; }
↩(){
	local t=$(while :; do
		t=($(shopt -s nullglob; echo {ru[n],inde[x],mai[n]}{,.sh,.ζ,.js,.py}))
		[[ $t != '' ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo $'\e[35m'"$(home_link "$t")"$'\e[0m'; cd "$(dirname "$t")"; chmodxprint "$t"; "$t" "$@"; }; }

################# should be system commands (interactive only) #################
shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=10000
dgrey='\[\e[1;30m\]'; red='\[\e[31m\]'; green='\[\e[32m\]'; purple='\[\e[35m\]'; reset='\[\e[0m\]'; goX(){ printf '\[\e['$1'G\]'; }
export PROMPT_COMMAND='    lx=$?; hash -r; if [[ $last_dir != $PWD ]]; then PWF=""; last_dir="$PWD"; fi    '
export PS1='=== $(
	[[ $lx = 0 ]] || printf '"$red$(goX 1)"'"$([[ $lx = 1 ]] && printf === || printf $lx" ")"'"$(goX 5)"'
	printf '"$green"'"$(home_link "$PWD")$([ -z "$PWF" ] || printf /'"$purple"'"$PWF")"'"$reset"'
	)'"$(goX 78)"'===\n'"$dgrey"'>'"$reset"' '
alias -- -='cd -'
chx(){ chmod +x "$1"; }
64e(){ base64; }
64d(){ base64 -D; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a "Sublime Text.app" -f; else if [[ $# = 0 ]]; then printf 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
ll(){ ls -AGl "$@"; }
la(){ ls -AG "$@"; }
f(){ open -a 'Path Finder' "${1:-.}"; osascript -e 'tell app "path finder" to activate'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
…(){ bash -s; }
del(){ for v in "$@"; do v="$(realpath "$v")"; -q osascript -e 'tell app "finder" to delete POSIX file "'"$v"'"'; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ (-q qlmanage -p "$@" &); }
man(){ local t="$(/usr/bin/man "$@")"; [[ $? = 1 ]] || echo "$t" | col -bfx | sb; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
# pb(){ local v="$(ζ -p '"pastebin_jsonp("+JSON.stringify(ι)+")"' | _pastebin_id)"; _chrome "$v"; v="http://alice.sh/txt#$v"; echo "$v" | tr -d '\n' | p; echo "copied: "; }
pb(){ local v="$(_pastebin_id)"; _chrome "http://pastebin.com/raw/$v"; v="http://alice.sh/txt#$v"; echo "$v" | p; echo "copied: $v"; }
/(){ -q pushd ~/ali/github; ag "$@" .{,/scratch/dotfiles/.{key,bash}rc} --ignore 'public/lib/' | sb; -q popd; }
alias ,='home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then local t="$(dirname "$v")"; last_dir="$(realpath "$t")"; builtin cd "${@:1:($#-1)}" "$t"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; }

############################ im_ (interactive only) ############################
im_size() { for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
im_to_png(){ for v in "$@"; do [[ $v = *.png ]] || { convert "$v" png:"${v%.*}.png" && rm "$v"; }; done; }
# im_to_png(){ λ 'ι.map(ι => /\.png$/.λ(ι) || shᵥ`convert ${ι} png:${ι minus extension}.png && rm ${ι}`)' "$@"; }
im_to_grey(){ for v in "$@"; do convert "$v" -colorspace gray "$v"; done; }
im_pdf_to_png__bad() { for v in "$@"; do convert -verbose -density 150 -trim "$v" -quality 100 -sharpen 0x1.0 png:"${v%.*}.png"; done; }
im_resize(){ local t="$1"; shift; for v in "$@"; do convert -scale "$t" "$v" "$v"; done; } #! wth are you using scale
im_concat(){
	local tile=$(echo "$1" | egrep -q '^(\d+x\d*|x\d+)$' && { echo "$1"; shift; } || echo x1)
	local out="${@: -1}"; if ! [ -e "$out" ]; then set -- "${@:1:$(($#-1))}"; else while [ -e "$out" ]; do out="${out%.*}~.${out##*.}"; done; fi
	montage -mode concatenate -tile "$tile" "$@" "$out"; }
im_rotate_jpg(){ jpegtran -rotate "$1" -outfile "$2" "$2"; }
im_dateify(){
	local echo=$([[ $1 = -d ]] && echo echo)
	for v in *.jpg; do local t=$(identify -verbose "$v" | grep exif:DateTimeOriginal | sed -E 's/^ +[a-zA-Z:]+ //'); $echo mv "$v" "$(echo $t | awk '{ print $1 }' | tr : -)T$(echo $t | awk '{ print $2 }')Z.jpg"; done; }

################## single-purpose commands (interactive only) ##################
rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,ali/**/}.DS_STORE ); sudo find /private/var/folders -name com.apple.dock.iconcache -exec rm {} \;; }
d(){ ( shopt -s nullglob; cd "${1:-.}"; for v in .[!.] .??* * .; do du -hs "$v" 2>/dev/null | sed $'s/\t.*//' | tr '\n' '\t'; find "$v" 2>/dev/null | wc -l | tr '\n' '\t'; echo "$v"; done ) }
comic_rotate(){
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
cache_imgurs(){ for v in "$@"; do local o=~/"ali/misc/.cache/imgur/$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/"Downloads/$2.%(ext)s" "$1"; }
############ nlog ############
nlog(){ f ~/ali/history/text\ logs/nihil/; }
nlog₋₁(){ ql "$(ζ -p 'φ`~/ali/history/text logs/nihil/*`.φs.sort()[-1]+""')"; }
nlog↩(){ mv ~/Downloads/201[6-9]-??-??T??:??:??*Z.png ~/ali/history/text\ logs/nihil/; }
##############################
dl_fix(){ f ~/Downloads; f ~/pg; λ '
	fs ← require("fs")
	from ← process.env.HOME+"/Downloads"
	out ← process.env.HOME+"/pg"
	fix ← ι => ι
		.replace(/^Impro_ Improvisation and the Theatre -/,"Impro -")
	fs.readdirSync(from).filter(/\.64$/.λ).map(λ(ι){fs.writeFileSync(out+"/"+fix(ι).replace(/\.64$/,""), Buffer(fs.readFileSync(from+"/"+ι)+"","base64")); fs.unlinkSync(from+"/"+ι)})
	'; }
email(){ λ '
	shᵥ`bash -ci ack`
	sb().split(/\n{3,}/g).map(λ(ι){var [a,b,…c] = ι.split("\n"); c = c.join("\n"); ↩ ("mailto:"+a+"?subject="+b+"&body="+c).replace(/\n/g,"%0A")})
		.map(ι => osaᵥ`chrome: open location ${ι}`)
	osaᵥ`chrome: activate`
	'; }
alias ct=chrome_tabs; chrome_tabs(){ λ '
	nice_ ← λ(title,url){t ← new String(title+" "+url); t.sourcemap = {title:[0,title.length], url:[(title+" ").length,(title+" "+url).length]}; ↩ nice_url(t)}
	var [title,url] = osaᵥ`chrome: get {title,URL} of tabs of windows`
	i ← ι[0]
	if (i) {i = parseInt(i); t ← nice_(title[0][i],url[0][i]); p(t); print(t+"\n<copied>")}
	else {t ← _.zip(title,url).map(ι => _.zip(…ι)).map(ι => ι.map(ι => nice_(…ι)).join("\n")).join("\n\n"); sb(t)}
	' "$@"; }
bookmarks(){ λ '
	//! should use nice_url
	ι = φ(ι[0]).json.roots.bookmark_bar.children
	t ← (λ λ(ι){↩ ι instanceof Array? ι.map(λ).join("\n") :
		ι.children? (ι.name+"\n"+ι.children.map(λ).join("\n")).replace(/\n/g,"\n  ") :
		ι.url === "http://transparent-favicon.info/favicon.ico"? ι.name :
		ι.url? (!ι.name || ι.url === ι.name? ι.url : ι.name+" "+ι.url) :
			JSON.stringify(ι)})(ι); sb(t)
	' "${1:-~/Library/Application Support/Google/Chrome/Default/Bookmarks}"; }
alias kp=keypresses; keypresses(){ λ '
	diy_stdin ← λ(f){process.stdin.setRawMode(true); process.stdin.resume().setEncoding("utf8").on("data",λ(key){f(key) === -1 && process.stdin.pause()})}
	disp ← ["",…";;;;#;;;;█;;;;#;;;;█".split("")].join("-".repeat(9))
	o←; diy_stdin(λ(ι){if (!o) o = hrtime(); else print(disp.slice(0,floor((-o+(o=hrtime()))*100)))})
	'; }

############################# system configuration #############################
# -q which brew || ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # from http://brew.sh/
# # for v in /* ~/* ~/Library/LaunchAgents/*; do [ -h "$v" ] && printf "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# ln -sf ~/ali/github/scratch/{spotiman,bandcamp-dl,dotfiles/{.bashrc,.keyrc}} ~/ali/books ~
# ln -sf ~/books/\#papers ~/papers
# ln -sf ~/books/#misc/page_cache ~/pg
# ln -sf ~/books/TheHourglassGrimoire/TheHourglassGrimoire.html ~/the-hourglass-grimoire
# ln -sf ~/ali/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# -q which realpath || { echo $'\e[41mrealpath not found\e[0m'; echo 'git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx'; echo $'\e[41m--------\e[0m'; }
# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool false
# defaults write com.apple.loginwindow PowerButtonSleepsSystem -bool false

################################## deprecated ##################################
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
# async(){ ("$@" &) & }
# here’s a way to easily modify your macros key: { rm "$rc"; jq ".macros=$macros" > "$rc"; } < "$rc"
# How to make the tagtime daemon automatically start on bootup in OSX: sudo ln -s /path/to/tagtimed.pl /Library/StartupItems/tagtimed.pl
# not [for t in $(find . -type f); do echo $t; done], instead [find . -type f -print0 | while IFS= read -r -d $'\0' t; do echo $t; done]

# ls|sbᵥ|… looks hard. a start: φ`/tmp/*`.φs.filter(λ(ι){↩ /\/subl stdin /.λ(ι+'')})._.sortBy(λ(ι){↩ ι.birthtime})[-1]

# opencp(){ sudo launchctl load /Library/LaunchDaemons/com.crashplan.engine.plist; /Applications/CrashPlan.app/Contents/MacOS/CrashPlan & }
# killcp(){ sudo launchctl unload /Library/LaunchDaemons/com.crashplan.engine.plist; }
# __rc_t1(){ if ! [[ $1 =~ [=] ]] && [ -f "$1" ] && ! [[ -x $1 ]]; then chmodxprint "$1"; fi; }; __rc_t2(){ __rc_t1 $BASH_COMMAND; }; trap __rc_t2 DEBUG
# cdw(){ local t="$(which "$1")"; [[ $? != 0 ]] && return 1; cd "$(realpath "$t/..")"; }
