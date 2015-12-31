__dirname="$(dirname $(/usr/local/bin/realpath "${BASH_SOURCE[0]}"))"
########### private ##########
-q(){ "$@" &>/dev/null; }
is_term(){ osascript -e 'path to frontmost application' | -q grep Terminal.app; }
chmodxprint(){ a=$(stat -f "%p" "$1"); chmod +x "$1"; b=$(stat -f "%p" "$1"); [[ $a == $b ]] || echo "${purple}chmod +x \"$1\"$reset"; }
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && echo "~${1:${#HOME}}" || echo "$1"; }
_chrome(){ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$([[ $1 =~ ^https?:// ]] && echo "$1" || echo "https://www.google.com/search?q=$(echo "$1" | ζ -p 'encodeURIComponent(ι)')")"; osascript -e 'tell app "chrome" to activate'; }
_pastebin_id(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&$(cat ~/.auth/pastebin)" --data-urlencode "api_paste_code=$v" | sed -e 's/.*com\///'; }
# _pastebin(){ local v=$(cat); c=--$'BtJctBOZ9e8RBV3JgbU\nContent-Disposition: form-data; name='; echo "http://pastebin.com/raw$(curl -s -D - 'http://pastebin.com/post.php' -H 'Content-Type: multipart/form-data; boundary=BtJctBOZ9e8RBV3JgbU' --data-binary "$c"$'"csrf_token"\n\nMTQ1MDQwNDA0NHZscEhXME9Scm12Q2l2V0ZPVFdqaGFLcWxQeXRZN3lS\n'"$c"$'"submit_hidden"\n\nsubmit_hidden\n'"$c"$'"paste_code"\n\n'"$v"$'\n'"$c"$'"paste_private"\n\n1\n--'$'BtJctBOZ9e8RBV3JgbU\n' | grep location | sed -e 's/location: //')"; }
_alert(){ osascript -ss -e 'tell app "system events" to display alert "'"$1"'"'"$([ -n "$2" ] && echo ' message "'"$2"'"')$([ -n "$3" ] && echo ' giving up after "'"$3"'"')"; }

###### interactive only ######
shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=10000
export PS1='$(E=$?; echo \[$([[ $E = 0 ]] && echo $green || echo $red)\]$([[ $E = 0 || $E = 1 ]] || echo "$E. ")$(this)\[$reset\]" ")'
__rc_t1(){ if ! [[ $1 =~ [=] ]] && [ -f "$1" ] && ! [[ -x $1 ]]; then chmodxprint "$1"; fi; }; __rc_t2(){ __rc_t1 $BASH_COMMAND; }; trap __rc_t2 DEBUG

64e(){ base64; }
64d(){ base64 -D; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a "Sublime Text.app" -f; else if [[ $# = 0 ]]; then printf 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
opencp(){ sudo launchctl load /Library/LaunchDaemons/com.crashplan.engine.plist; /Applications/CrashPlan.app/Contents/MacOS/CrashPlan & }
killcp(){ sudo launchctl unload /Library/LaunchDaemons/com.crashplan.engine.plist; }
f(){ open -a 'Path Finder' "${1:-.}"; osascript -e 'tell app "path finder" to activate'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
clear(){ /usr/bin/clear && printf '\e[3J'; }
…(){ bash -s; }
alias pwf='echo "$(home_link "$PWD/$1")"'
alias ct=chrome_tabs; chrome_tabs(){ ζ -e '
	t ← osaᵥ("tell app \"chrome\" to get {title,URL} of tabs of windows"); title ← t[0]; url ← t[1]
	i ← '"$(echo "$1" | jq -R .)"'
	if (i) {i = parseInt(i); t ← title[0][i]+" "+nice_url(url[0][i]); p(t); print(t+"\n<copied>")}
	else {t ← _.zip(title,url).map(ι => _.zip(…ι)).map(ι => ι.map(ι => ι.join(" ")).map(nice_url.X).join("\n")).join("\n\n"); sb(t)}
	'; }
bookmarks(){ ζ -e '
	ι ← JSON.parse(fs("'"${1:-~/Library/Application Support/Google/Chrome/Default/Bookmarks}"'").$).roots.bookmark_bar.children
	t ← (λ λ(ι){↩ ι instanceof Array? ι.map(λ).join("\n") :
		ι.children? (ι.name+"\n"+ι.children.map(λ).join("\n")).replace(/\n/g,"\n  ") :
		ι.url === "http://transparent-favicon.info/favicon.ico"? ι.name :
		ι.url? (!ι.name || ι.url === ι.name? ι.url : ι.name+" "+ι.url) :
			JSON.stringify(ι)})(ι); sb(t)
	'; }
d(){ ( shopt -s nullglob; cd "${1:-.}"; for v in .[!.] .??* * .; do du -hs "$v" 2>/dev/null | sed $'s/\t.*//' | tr '\n' '\t'; find "$v" 2>/dev/null | wc -l | tr '\n' '\t'; echo "$v"; done ) }
del(){ for v in "$@"; do v="$(realpath "$v")"; -q osascript -e 'tell app "finder" to delete POSIX file "'"$v"'"'; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ (-q qlmanage -p "$@" &); }
man(){ /usr/bin/man "$@" | col -bfx | sb; }
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
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
# pb(){ local v="$(ζ -p '"pastebin_jsonp("+JSON.stringify(ι)+")"' | _pastebin_id)"; _chrome "$v"; v="http://alice0meta.github.io/txt#$v"; echo "$v" | tr -d '\n' | p; echo "copied: "; }
pb(){ local v="$(_pastebin_id)"; _chrome "http://pastebin.com/raw/$v"; v="http://alice0meta.github.io/txt#$v"; echo "$v" | p; echo "copied: $v"; }
dl_fix(){ f ~/Downloads; f ~/pg; ζ -e '
	from ← process.env.HOME+"/Downloads"
	out ← process.env.HOME+"/pg"
	fix ← ι => ι
		.replace(/^Impro_ Improvisation and the Theatre -/,"Impro -")
	fs.readdirSync(from).filter(/\.64$/.λ).map(λ(ι){fs.writeFileSync(out+"/"+fix(ι).replace(/\.64$/,""), Buffer(fs.readFileSync(from+"/"+ι)+"","base64")); fs.unlinkSync(from+"/"+ι)})
	'; }

### interactive & external ###
export PATH="./node_modules/.bin:/usr/local/bin:$HOME/ali/github/scratch:$PATH:."
export red=$(tput setaf 1); export green=$(tput setaf 2); export purple=$(tput setaf 5); export reset=$(tput sgr0)
date_i(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
this(){ home_link "$PWD"; }
x(){ E=$?; if [[ $E = 0 ]]; then is_term || beep $E; exit; fi; is_term || { osascript -e 'tell app "terminal" to activate'; beep $E; }; return $E; }
rmds(){ ( shopt -s globstar; rm -f ~/{,Desktop,Downloads}/.DS_STORE ~/ali/**/.DS_STORE ) }
↩(){
	local t=$(while :; do
		t=($(shopt -s nullglob; echo {ru[n],inde[x],mai[n]}{,.sh,.ζ,.js,.py}))
		[[ $t != "" ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo "$purple$(home_link "$t")$reset"; cd $(dirname "$t"); chmodxprint "$t"; "$t" "$@"; }; }

######## external only #######
](){ echo "$*" | ζ -e 'osaᵥ("tell app \"system events\" \n" +
	// you can also use `key code`s, which are the same as the ones specified in `[keycode]` !
	ι.split(/ +] +/g).map(ι =>
		(t=/^FnF(.)$/.λ(ι))? "key code "+[,107,113][t[1]]||(λ(){throw Error()})() :
			"keystroke "+osa_encode(ι.replace(/^⌘/,""))+(/^⌘/.λ(ι)? " using command down" : "")
			).join("\n") + "\n end tell")'; }
_in_new_terminal(){ echo "{ $1; } &>/dev/null; exit" > /tmp/__·; osascript -e 'tell app "terminal" to do script "·"'; }
alias ·='eval "$(cat /tmp/__·)"; rm /tmp/__·;'

####### not interactive ######
beep(){ (afplay "$__dirname/$([[ $1 = 1 ]] && echo "fail.wav" || echo "done.wav")" &); }
ack(){ (afplay "$__dirname/ack.wav" &); }
nack(){ (afplay "$__dirname/nack.wav" &); }

#### system configuration ####
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
# async(){ ("$@" &) & }
# here’s a way to easily modify your macros key: { rm "$rc"; jq ".macros=$macros" > "$rc"; } < "$rc"
# How to make the tagtime daemon automatically start on bootup in OSX: sudo ln -s /path/to/tagtimed.pl /Library/StartupItems/tagtimed.pl
# not [for t in $(find . -type f); do echo $t; done], instead [find . -type f -print0 | while IFS= read -r -d $'\0' t; do echo $t; done]

# ls|sbᵥ|… looks hard. a start: fs('/tmp').find('>').filter(λ(ι){↩ /\/subl stdin /.λ(ι)})._.sortBy(λ(ι){↩ fs.statSync(ι).birthtime})[-1]
