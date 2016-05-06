[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || export PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || export PATH="./node_modules/.bin:$PATH:."
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
#################################### private ###################################
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && printf %s "~${1:${#HOME}}" || printf %s "$1"; } # should instead be a function that compresses all of the standard symlinks
_chrome(){ chrome "$([[ $1 =~ ^https?:// ]] && printf %s "$1" || printf %s "https://www.google.com/search?q=$(ζ 'encodeURIComponent(ι)' "$1")")"; }
chrome(){ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$1"; ζ 'osaᵥ`chrome: activate`'; }
_alert(){ ζ ' osaᵥ`system events: display alert ${a0} …${a1 && osa`message ${a1}`} …${a2 && osa`giving up after ${a2}`}` ;' "$@"; }
####### single-purpose #######
_pastebin_id(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&$(cat ~/.auth/pastebin)" --data-urlencode "api_paste_code=$v" | sed -e 's/.*com\///'; } # pb
# _pastebin(){ local v=$(cat); c=--$'BtJctBOZ9e8RBV3JgbU\nContent-Disposition: form-data; name='; printf %s "http://pastebin.com/raw$(curl -s -D - 'http://pastebin.com/post.php' -H 'Content-Type: multipart/form-data; boundary=BtJctBOZ9e8RBV3JgbU' --data-binary "$c"$'"csrf_token"\n\nMTQ1MDQwNDA0NHZscEhXME9Scm12Q2l2V0ZPVFdqaGFLcWxQeXRZN3lS\n'"$c"$'"submit_hidden"\n\nsubmit_hidden\n'"$c"$'"paste_code"\n\n'"$v"$'\n'"$c"$'"paste_private"\n\n1\n--'$'BtJctBOZ9e8RBV3JgbU\n' | grep location | sed -e 's/location: //')"; }
set_term_title(){ printf %s "\033]0;%s\007" "$1"; } # this_term_is_frontmost
this_term_is_frontmost(){ local t=__$RANDOM; set_term_title $t; local r="$(ζ 'osaᵥ`terminal: frontmost of (windows whose custom title = ${ι})`[0]' "$t")"; set_term_title ''; [[ $r = true ]]; } # x
clear(){ /usr/bin/clear && printf %s $'\e[3J'; } # sublime open terminal

################################ not interactive ###############################
sfx(){ ( afplay "$__dirname/$1.wav" &); }

################################## .keyrc only #################################
](){ ζ 'ι = a.join(" "); 
	// you can also use `key code`s, which are the same as the ones specified in `[keycode]` !
	ι = ι.split(/ +] +/g).map(ι =>
		(t=ι.re`^FnF(.)$`)? "key code "+[,107,113][t[1]]||‽ :
		(t={"↩":36}[ι])? "key code "+t :
			osa`keystroke ${ι.replace(/^⌘/,"")}`+(ι.re`^⌘`? " using command down" : "")
		).join("\n")
	osaᵥ`system events: …${ι}`
	;' "$@"; }
_in_new_terminal(){ ζ '    φ`/tmp/__·`.text = "{ "+ι+"; } &>/dev/null; exit"; osaᵥ`terminal: do script "·"`    ;' "$1"; }
_sc(){ mutex get sc; screencapture "$@"; mutex release sc; }
_imgur(){ mutex get imgur; curl -sH "Authorization: Client-ID 3e7a4deb7ac67da" -F "image=@$1" "https://api.imgur.com/3/upload" | jq -r .data.link; mutex release imgur; }
_sc_imgur(){ t=/tmp/sc_$RANDOM.png; _sc $1 "$t"; (_alert 'uploading to imgur' '...' 1.5 &); v="$(_imgur "$t")"; _chrome "$v"; echo "$(echo "$v" | googl)#imgur" | p; rm "$t"; }
_bright(){ ζ 'br ← npm("brightness@3.0.0"); set ← ι => br.set(ι > 0.5? (ι===1? 1 : ι-1/64) : (ι===0? 0 : ι+1/64)).then(()=> osaᵥ`system events: key code ${ι > 0.5? 113 : 107} using {shift down, option down}`); ιs ← [0,1,2.5,5.5,10.5,16].map(ι=>ι/16); br.get().then(ι => set("'"$1"'"==="up"? ιs.filter(t => t > ι)[0]||1 : ιs.filter(t => t < ι)[-1]||0)) ;'; }

################################# external only ################################
alias ·='eval -- "$(cat /tmp/__·)"; rm /tmp/__·;'

############################ interactive & external ############################
x(){ local E=$?; this_term_is_frontmost || { [[ $E = 0 ]] && sfx done || { sfx fail; ζ 'osaᵥ`terminal: activate`;'; }; }; [[ $E = 0 ]] && exit; return $E; }
↩(){
	local t=$(while :; do
		t=($(shopt -s nullglob; echo {ru[n],inde[x],mai[n]}{,.sh,.ζ,.js,.py}))
		[[ $t != '' ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo $'\e[35m'"$(home_link "$t")"$'\e[0m'; cd "$(dirname "$t")"; chmod +x "$t"; "$t" "$@"; }; }
# ζ(){ if [[ $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; }
ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; }

################# should be system commands (interactive only) #################
shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=10000
dgrey='\e[1;30m'; red=$'\e[31m'; green=$'\e[32m'; purple=$'\e[35m'; reset=$'\e[0m'; goX(){ printf %s $'\e['$1'G'; }
export PROMPT_COMMAND='    lx=$?;    _PC_t    '; last_dir=~; _PC_t(){
	hash -r
	if [[ $last_dir != $PWD ]]; then last_dir="$PWD"; if [[ $PWFdirty = 0 ]]; then PWFdirty=1; else PWF=""; fi; do_ls=1; else do_ls=0; fi
	printf %s '=== '; [[ $lx = 0 ]] || { printf %s "$red"; goX 1; [[ $lx = 1 ]] && printf %s === || printf %s "$lx "; goX 5; }
	printf %s "$green"; home_link "$PWD"; [ -z "$PWF" ] || printf %s "/$purple$PWF"; printf %s "$reset"; goX 78; printf %s ===
	[[ $do_ls = 1 ]] && CLICOLOR_FORCE=1 ls -AGC; }
export PS1='\['"$dgrey"'\]>\['"$reset"'\] '
alias -- -='cd ~-'
chx(){ chmod +x "$1"; }
64e(){ base64; }
64d(){ base64 -D; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a "Sublime Text.app" -f; else if [[ $# = 0 ]]; then printf %s 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
ll(){ ls -AGl "$@"; }
la(){ ls -AG "$@"; }
f(){ open -a 'Path Finder' "${1:-.}"; ζ 'osaᵥ`path finder: activate`'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
…(){ bash -s; }
del(){ for v in "$@"; do v="$(realpath "$v")"; ζ 'osaᵥ`finder: delete POSIX file ${ι}`;' "$v"; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ ( &>/dev/null qlmanage -p "$@" &); }
man(){ local t="$(/usr/bin/man "$@")"; [[ $? = 1 ]] || echo "$t" | col -bfx | sb; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
pb(){ local v="$(_pastebin_id)"; _chrome "http://pastebin.com/raw/$v"; v="http://alice.sh/txt#$v"; echo "$v" | p; echo "copied: $v"; }
/(){ &>/dev/null pushd ~/ali/github; ag "$@" .{,/scratch/dotfiles/.{key,bash}rc} --ignore 'public/lib/' | sb; &>/dev/null popd; }
alias ,='home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then PWFdirty=0; builtin cd "${@:1:($#-1)}" "$(dirname "$v")"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; }
alias ps=$'echo \e[41muse ps2 instead\e[0m; ps'
ps2(){ ζ '
	startup_procs ← λ(){ ιs ← (shᵥ`ps -A -o pid,lstart`+"").split("\n").slice(1).map(λ(ι){var [ˣ,pid,d] = ι.trim().re`^(\d+) (.*)`; ↩ [parseInt(pid), Time(d).i]}); t ← ιs._.map(1)._.min(); t = t + (t < Time().i - 2*3600? 30*60 : 20); ↩ ιs.filter(ι => ι[1] < t)._.map(0); }
	bad ← startup_procs()._.countBy()
	r ← (shᵥ`ps -x -o pid,etime,%cpu,command`+"").split("\n")
	h ← r.shift()
	CMD ← ι => ι.slice(h.search("COMMAND"))
	ETIME ← ι => ι.slice(5,h.search("ELAPSED")+"ELAPSED".length)
	h+"\n"+r
		.filter(ι => !bad[ι.re`^ *(\d*)`[1]])
		.filter(ι => !ι.includes("3vf2pkkz1i2dfgvi") && !CMD(ι).re`^(login |ps |/System/Library/(PrivateFrameworks|Frameworks|CoreServices)/|/Applications/(GitHub Desktop|Google Chrome|Steam|Spotify|BetterTouchTool).app/)`)
		._.sortBy(ETIME).reverse()
		.join("\n")+"\n"'; }

############################ im_ (interactive only) ############################
im_size() { for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
im_to_png(){ for v in "$@"; do [[ $v = *.png ]] || { convert "$v" png:"${v%.*}.png" && rm "$v"; }; done; }
# im_to_png(){ ζ ' a.map(ι => /\.png$/.λ(ι) || shᵥ`convert ${ι} png:${ι minus extension}.png && rm ${ι}`) ;' "$@"; }
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
d(){ ζ '♈ ← ι || "."
	sum ← 0
	♓ ← (ι,fl) => cn.log( (" ".repeat(17)+(ι+"").split("").reverse().join("").replace(/(...(?!$))/g,"$1,").split("").reverse().join("")).slice(-17)+"  "+fl )
	fs.readdirSync(♈).map(λ(fl){
		if (φ(fl).is_dir){
			o ← process.stderr.write; process.stderr.write = λ(){}; try{ t ← shᵥ`du -sk ${♈}/${fl}` }catch(e){ t ← e.stdout }; process.stderr.write = o
			b ← +(t+"").re`^\d+`[0] * 1024 }
		else b ← φ(fl).size
		sum += b; ♓(b,fl) })
	♓(sum,♈)
	;' "$1"; }
comic_rotate(){
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
cache_imgurs(){ for v in "$@"; do local o=~/"ali/misc/.cache/imgur/$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/"Downloads/$2.%(ext)s" "$1"; }
kc(){ sudo killall coreaudiod; }
############ nlog ############
nlog(){ f ~/ali/history/text\ logs/nihil/; }
nlog₋₁(){ ql "$(ζ 'φ`~/ali/history/text logs/nihil/*`.φs.sort()[-1]+""')"; }
nlog↩(){ mv ~/Downloads/{nlog\ *.json,201[6-9]-??-??T??:??:??*Z.png} ~/ali/history/text\ logs/nihil/; }
##############################
# dl_fix(){ f ~/Downloads; f ~/pg; ζ '
# 	fs ← require("fs")
# 	from ← process.env.HOME+"/Downloads"
# 	out ← process.env.HOME+"/pg"
# 	fix ← ι => ι
# 		.replace(/^Impro_ Improvisation and the Theatre -/,"Impro -")
# 	fs.readdirSync(from).filter(/\.64$/.λ).map(λ(ι){fs.writeFileSync(out+"/"+fix(ι).replace(/\.64$/,""), Buffer(fs.readFileSync(from+"/"+ι)+"","base64")); fs.unlinkSync(from+"/"+ι)})
# 	;'; }
email(){ ζ '
	sfx`ack`
	sb().split(/\n{3,}/g).map(λ(ι){var [a,b,…c] = ι.split("\n"); c = c.join("\n"); ↩ ("mailto:"+a+"?subject="+b+"&body="+c).replace(/\n/g,"%0A")})
		.map(ι => osaᵥ`chrome: open location ${ι}`)
	osaᵥ`chrome: activate`
	;'; }
alias ct=chrome_tabs; chrome_tabs(){ ζ '
	nice_ ← λ(title,url){t ← new String(title+" "+url); t.sourcemap = {title:[0,title.length], url:[(title+" ").length,(title+" "+url).length]}; ↩ nice_url(t)}
	var [title,url] = osaᵥ`chrome: get {title,URL} of tabs of windows`
	i ← ι
	if (i) {i = parseInt(i); t ← nice_(title[0][i],url[0][i]); p(t); process.stdout.write(t+"\n<copied>\n")}
	else {t ← _.zip(title,url).map(ι => _.zip(…ι)).map(ι => ι.map(ι => nice_(…ι)).join("\n")).join("\n\n"); sb(t)}
	;' "$1"; }
bookmarks(){ ζ '
	//! should use nice_url
	ι = φ(ι||"~/Library/Application Support/Google/Chrome/Default/Bookmarks").json.roots.bookmark_bar.children
	t ← (λ λ(ι){↩ ι instanceof Array? ι.map(λ).join("\n") :
		ι.children? (ι.name+"\n"+ι.children.map(λ).join("\n")).replace(/\n/g,"\n  ") :
		ι.url === "http://transparent-favicon.info/favicon.ico"? ι.name :
		ι.url? (!ι.name || ι.url === ι.name? ι.url : ι.name+" "+ι.url) :
			JSON.stringify(ι)})(ι); sb(t)
	;' "$1"; }
alias kp=keypresses; keypresses(){ ζ --fresh '
	diy_stdin ← λ(f){ process.stdin.setRawMode(true); process.stdin.resume().setEncoding("utf8").on("data",λ(key){ f(key) === -1 && process.stdin.pause() }) }
	disp ← ["",…";;;;#;;;;█;;;;#;;;;█".split("")].join("-".repeat(9))
	o←; diy_stdin(λ(ι){if (!o) o = hrtime(); else process.stdout.write(disp.slice(0,floor((-o+(o=hrtime()))*100))+"\n")})
	;'; }

############################# system configuration #############################
# -q which brew || ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # from http://brew.sh/
# -q which realpath || { echo $'\e[41mrealpath not found\e[0m'; echo 'git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx'; echo $'\e[41m--------\e[0m'; }

# # for v in /* ~/* ~/Library/LaunchAgents/*; do [ -h "$v" ] && printf %s "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# ln -sf ~/ali/github/scratch/{spotiman,bandcamp-dl,dotfiles/{.bashrc,.keyrc}} ~/ali/books ~
# ln -sf ~/books/\#papers ~/papers
# ln -sf ~/books/#misc/page_cache ~/pg
# ln -sf ~/ali/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# ln -sf ~/Library/Spelling/LocalDictionary ~/Library/'Application Support/Sublime Text 3'/Local ~/Library/'Application Support'/Google/Chrome/Default/Bookmarks ~/ali/notes/#auto
# for v in ~/ali/github/scratch/*; do [ -f "$v" ] && [ -x "$v" ] && ln -sf "$v" /usr/local/bin; done

# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool false
# defaults write com.apple.loginwindow PowerButtonSleepsSystem -bool false

################################## deprecated ##################################
# ls|sbᵥ|… looks hard. a start: φ`/tmp/*`.φs.filter(λ(ι){↩ /\/subl stdin /.λ(ι+'')})._.sortBy(λ(ι){↩ ι.birthtime})[-1]
# cdw(){ local t="$(which "$1")"; [[ $? != 0 ]] && return 1; cd "$(realpath "$t/..")"; }
