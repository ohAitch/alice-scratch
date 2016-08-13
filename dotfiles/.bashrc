[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || export PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || export PATH="./node_modules/.bin:$PATH:."
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

#################################### private ###################################
home_link(){ [[ $HOME = ${1:0:${#HOME}} ]] && printf %s "~${1:${#HOME}}" || printf %s "$1"; } # should instead be a function that compresses all of the standard symlinks
chrome(){ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$1"; ζ 'osaᵥ`chrome: activate`'; }
_chrome(){ chrome "$([[ $1 =~ ^https?:// ]] && printf %s "$1" || printf %s "https://www.google.com/search?q=$(ζ 'encodeURIComponent(ι)' "$1")")"; }
_alert(){ ζ ' osaᵥ`system events: display alert ${a0} …${a1 && osa`message ${a1}`} …${a2 && osa`giving up after ${a2}`}` ;' "$@"; }
####### single-purpose #######
_pastebin_id(){ local v=$(cat); curl -s 'http://pastebin.com/api/api_post.php' -d "api_option=paste&api_paste_private=1&$(cat ~/.auth/pastebin)" --data-urlencode "api_paste_code=$v" | sed -e 's/.*com\///'; } # pb
# _pastebin(){ local v=$(cat); c=--$'BtJctBOZ9e8RBV3JgbU\nContent-Disposition: form-data; name='; printf %s "http://pastebin.com/raw$(curl -s -D - 'http://pastebin.com/post.php' -H 'Content-Type: multipart/form-data; boundary=BtJctBOZ9e8RBV3JgbU' --data-binary "$c"$'"csrf_token"\n\nMTQ1MDQwNDA0NHZscEhXME9Scm12Q2l2V0ZPVFdqaGFLcWxQeXRZN3lS\n'"$c"$'"submit_hidden"\n\nsubmit_hidden\n'"$c"$'"paste_code"\n\n'"$v"$'\n'"$c"$'"paste_private"\n\n1\n--'$'BtJctBOZ9e8RBV3JgbU\n' | grep location | sed -e 's/location: //')"; }
_ag(){ local v="$1"; shift; &>/dev/null pushd "$v"; ag "$@"; &>/dev/null popd; } # /
########## external ##########
clear(){ /usr/bin/clear && printf %s $'\e[3J'; } # munge_stuff.py open terminal
alias ·='eval -- "$(cat /tmp/__·)"; rm /tmp/__·;' # index.ζ terminal_do_script

################################## .keyrc only #################################
_sc(){ mutex get sc; screencapture "$@"; mutex release sc; }
_imgur(){ mutex get imgur; curl -sH "Authorization: Client-ID 3e7a4deb7ac67da" -F "image=@$1" "https://api.imgur.com/3/upload" | jq -r .data.link; mutex release imgur; }
_sc_imgur(){ t=/tmp/sc_$RANDOM.png; _sc $1 "$t"; (_alert 'uploading to imgur' '...' 1.5 &); v="$(_imgur "$t")"; _chrome "$v"; echo "$(echo "$v" | googl)#imgur" | p; rm "$t"; }
_bright(){ ζ '  br ← npm("brightness@3.0.0"); set ← ι=> br.set(ι > 0.5? (ι===1? 1 : ι-1/64) : (ι===0? 0 : ι+1/64)).then(()=> robot_key_tap("⇧⌥FnF"+(ι > 0.5? 2 : 1))); ιs ← [0,1,2.5,5.5,10.5,16].map(ι=>ι/16); br.get().then(ι=> set(a0==="up"? ιs.filter(t=> t > ι)[0]||1 : ιs.filter(t=> t < ι)[-1]||0))  ;' "$1"; }

############################ interactive & external ############################
x(){ local E=$?; ζ '
	set_term_title ← ι=> process.stdout.write("\x1b]0;"+ι+"\x07")
	this_term_is_frontmost ← λ(){ t ← rand_id(25); set_term_title(t); r ← osaᵥ`terminal: frontmost of (windows whose custom title = ${t})`[0]; set_term_title(""); ↩ r }
	this_term_is_frontmost() || (a0==="0"? sfx`done` : (sfx`fail`, osaᵥ`terminal: activate`))
	' $E; [[ $E = 0 ]] && exit; return $E; }
build.*(){
	# todo: run the current file if you can't find any build files? that would be ... unclean, gosh, but i want something here
	[[ $PWD = ~/file/github/scratch/dotfiles ]] && { ~/github/scratch/keyrc.ζ; return $?; }
	local t=$(while :; do
		t=($(shopt -s nullglob; echo [b]uild{,.*}))
		[[ $t != '' ]] && echo "$PWD/$t" || [[ $PWD != / ]] && { cd ..; continue; }
		break; done)
	[ -z "$t" ] && { echo "no “main” command found"; return 1; } || { echo $'\e[35m'"$(home_link "$t")"$'\e[0m'; cd "$(dirname "$t")"; chmod +x "$t"; "$t" "$@"; }; }
ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; }

################# should be system commands (interactive only) #################
shopt -s no_empty_cmd_completion
shopt -s histappend; HISTCONTROL=ignoredups; HISTSIZE=1000; HISTFILESIZE=10000
dgrey=$'\e[90m'; red=$'\e[31m'; green=$'\e[32m'; purple=$'\e[35m'; reset=$'\e[0m'; goX(){ printf %s $'\e['$1'G'; }
export PROMPT_COMMAND='    lx=$?;    _PC_t    '; last_dir=~; _PC_t(){
	hash -r
	if [[ $last_dir != $PWD ]]; then last_dir="$PWD"; if [[ $PWFdirty = 0 ]]; then PWFdirty=1; else PWF=""; fi; do_ls=1; else do_ls=0; fi
	printf %s '=== '; [[ $lx = 0 ]] || { printf %s "$red"; goX 1; [[ $lx = 1 ]] && printf %s === || printf %s "$lx "; goX 5; }
	printf %s "$green"; home_link "$PWD"; [ -z "$PWF" ] || printf %s "/$purple$PWF"; printf %s "$reset"; goX 78; printf %s ===$'\n'
	[[ $do_ls = 1 ]] && CLICOLOR_FORCE=1 ls -AGC; }
export PS1='\['"$dgrey"'\]>\['"$reset"'\] '
alias -- -='cd ~-'
chx(){ chmod +x "$1"; }
64e(){ base64; }
64d(){ base64 -D; }
p(){ if [ -p /dev/fd/0 ]; then pbcopy; else pbpaste; fi; }
sb(){ if [ -p /dev/fd/0 ]; then open -a 'Sublime Text.app' -f; else if [[ $# = 0 ]]; then printf %s 'view.substr(view.full_line(sublime.Region(0,view.size())))' > /tmp/fs_ipc_34289; curl -s -X PUT 127.0.0.1:34289 | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }
ll(){ ls -AGl "$@"; }
la(){ ls -AG "$@"; }
f(){ open -a 'Path Finder' "${1:-.}"; ζ 'osaᵥ`path finder: activate`'; }
ar (){ tar -c "$@" | xz -v    > "$(basename "$1").tar.xz"; }
ar9(){ tar -c "$@" | xz -v -9 > "$(basename "$1").tar.xz"; }
…(){ eval "$(cat)"; }
del(){ for v in "$@"; do v="$(realpath "$v")"; ζ 'osaᵥ`finder: delete POSIX file ${ι}`;' "$v"; rm -f "$(dirname "$v")/.DS_STORE"; done; }
ql(){ ( &>/dev/null qlmanage -p "$@" &); }
man(){ local t="$(/usr/bin/man "$@")"; [[ $? = 1 ]] || echo "$t" | col -bfx | sb; }
googl(){ local v=$(cat); curl -s 'https://www.googleapis.com/urlshortener/v1/url?key='"$(cat ~/.auth/googl)" -H 'Content-Type: application/json' -d '{"longUrl": '"$(echo "$v" | jq -R .)"'}' | jq -r .id; }
pb(){ local v="$(_pastebin_id)"; _chrome "http://pastebin.com/raw/$v"; v="http://alice.sh/txt#$v"; echo "$v" | p; echo "copied: $v"; }
/(){
	# would be nice to search the text parts of ~/file/history but it's probably too illegible for that right now
	if [[ $1 = -h ]]; then _ag ~/file/notes "$2" .{,/.history}
	else _ag ~/github "$1" .{,/scratch{/dotfiles/.{key,bash}rc,/sublime/User/.sb-keyrc}} --ignore 'public/lib/'; _ag ~/file "$1" notes --ignore '#abandoned' --ignore '#auto' --ignore '#old stuff'
	fi | sb; }
alias ,='home_link "$PWD$([ -z "$PWF" ] || echo "/$PWF")"'
cd(){ local v="${!#}"; if (( "$#" )) && ! [[ -d "$v" ]]; then PWFdirty=0; builtin cd "${@:1:($#-1)}" "$(dirname "$v")"; PWF="$(basename "$v")"; else builtin cd "$@"; fi; }
ps2(){ ζ '
	startup_procs ← λ(){ ιs ← (shᵥ`ps -A -o pid,lstart`+"").split("\n").slice(1).map(λ(ι){var [ˣ,pid,d] = ι.trim().re`^(\d+) (.*)`; ↩ [parseInt(pid), Time(d).i]}); t ← ιs._.map(1)._.min(); t = t + (t < Time().i - 2*3600? 30*60 : 20); ↩ ιs.filter(ι=> ι[1] < t)._.map(0); }
	bad ← startup_procs()._.countBy()
	r ← (shᵥ`ps -x -o pid,etime,%cpu,command`+"").split("\n")
	h ← r.shift()
	CMD ← ι=> ι.slice(h.search("COMMAND"))
	ETIME ← ι=> ι.slice(5,h.search("ELAPSED")+"ELAPSED".length)
	h+"\n"+r
		.filter(ι=> !bad[ι.re`^ *(\d*)`[1]])
		.filter(ι=> !ι.includes("3vf2pkkz1i2dfgvi") && !CMD(ι).re`^(login |ps |/System/Library/(PrivateFrameworks|Frameworks|CoreServices)/|/Applications/(GitHub Desktop|Google Chrome|Steam|Spotify|BetterTouchTool).app/)`)
		._.sortBy(ETIME).reverse()
		.join("\n")+"\n"'; }
diff(){ ζ '
	t ← shᵥ`wdiff -n -w ${"\x1b[30;41m"} -x ${"\x1b[0m"} -y ${"\x1b[30;42m"} -z ${"\x1b[0m"} ${a} ;:`+""
	t = t.split("\n")
	iL ← t.map((ι,i)=> [ι,i]).filter(([ι,i])=> ι.re`\x1b\[30;4[12]m`).mapcat(([ι,i])=> _.range(max(0,i-3),min(i+3+1,t.length)))._.sortBy()._.uniq(true)
	iG ← []; iL.forEach(i=> iG[-1] && iG[-1][-1]===i-1? iG[-1].push(i) : iG.push([i]) )
	t = iG.map(ι=> ι.map(i=> [t[i],i]))
	t.forEach(λ(ι){ while (ι[-1][0]==="") ι.pop(); while (ι[0][0]==="") ι.shift() })
	t.map(ι=> ι.map(([ι,i])=> "\x1b[90m"+i+"\x1b[0m "+ι)
		.join("\n")+"\n")
		.join("\x1b[90m"+"-".repeat(30)+"\x1b[0m"+"\n")
	' "$@"; }
rm_empty_dirs(){ find . -type d -empty -delete; }

############################ im_ (interactive only) ############################
im_size() { for v in "$@"; do [ -f "$v" ] && { identify -format "%f %wx%h" "$v"; echo; }; done; }
im_to_png(){ for v in "$@"; do [[ $v = *.png ]] || { convert "$v" png:"${v%.*}.png" && rm "$v"; }; done; }
# im_to_png(){ ζ ' a.map(ι=> /\.png$/.λ(ι) || shᵥ`convert ${ι} png:${ι minus extension}.png && rm ${ι}`) ;' "$@"; }
im_to_grey(){ for v in "$@"; do convert "$v" -colorspace gray "$v"; done; }
im_pdf_to_png__bad() { for v in "$@"; do convert -verbose -density 150 -trim "$v" -quality 100 -sharpen 0x1.0 png:"${v%.*}.png"; done; }
im_resize(){ ζ 'for (t of a.slice(1)) shᵥ`convert -scale ${a0} ${t} ${t}` ;' "$@"; } #! wth are you using scale
im_concat(){
	local tile=$(ζ '!!ι.re`^(\d+x\d*|x\d+)$`' "$1" && { echo "$1"; shift; } || echo x1)
	local out="${@: -1}"; if ! [ -e "$out" ]; then set -- "${@:1:$(($#-1))}"; else while [ -e "$out" ]; do out="${out%.*}~.${out##*.}"; done; fi
	montage -mode concatenate -tile "$tile" "$@" "$out"; }
im_rotate_jpg(){ jpegtran -rotate "$1" -outfile "$2" "$2"; }
im_dateify(){ ζ '  dry ← a0==="-d"; dry && a.shift(); mv ← λ(a,b){a===b? 0 : dry? cn.log(sh`mv ${a} ${b}`) : φ(b).BAD_exists()? ‽ : fs.renameSync(a,b)}; a.filter(ι=> ι.re`\.jpg$`).map(λ(ι){ t ← (shᵥ`identify -verbose ${ι}`+"").re`exif:DateTimeOriginal: (.*)`; if (!t) ↩; t = t[1].split(" "); t = t[0].replace(/:/g,"-")+"T"+t[1]; mv(ι,(ι.re`PANO_`? (!dry && (φ(ι).φ`../PANO/tmp`.ι = "", φ(ι).φ`../PANO/tmp`.ι = null), "PANO/") : "")+t+".jpg") })  ;' "$@"; }
ff_crop(){ ffmpeg -i file:"$1" -ss "$2" -t "$3" -async 1 file:"${1%.*} cut".mp4; }
ff_to_audio(){ ffmpeg -i file:"$1" -vn file:"${1%.*}".mp3; }

################## single-purpose commands (interactive only) ##################
rm_bad_cache(){ ( shopt -s globstar; rm -f ~/{,Desktop/,Downloads/,file/**/}.DS_STORE ); sudo find /private/var/folders -name com.apple.dock.iconcache -exec rm {} \;; }
d(){ ζ 'a ← ι || "."
	sum ← 0
	q ← (ι,fl)=> cn.log( (" ".repeat(17)+(ι+"").split("").reverse().join("").replace(/(...(?!$))/g,"$1,").split("").reverse().join("")).slice(-17)+"  "+fl )
	fs.readdirSync(a).map(λ(fl){
		if (φ(fl).is_dir){
			o ← process.stderr.write; process.stderr.write = λ(){}; try{ t ← shᵥ`du -sk ${a}/${fl}` }catch(e){ t ← e.stdout }; process.stderr.write = o
			b ← +(t+"").re`^\d+`[0] * 1024 }
		else b ← φ(fl).size
		sum += b; q(b,fl) })
	q(sum,a)
	;' "$1"; }
comic_rotate(){
	mkdir '#rotated'; for v in *; do [[ $v = '#rotated' ]] || cp -r "$v" '#rotated'; done
	cd '#rotated'; find . -type f -print0 | while IFS= read -r -d $'\0' t; do convert -rotate 270 "$t" "$t"; done; }
cache_imgurs(){ for v in "$@"; do local o=~/file/misc/.cache/imgur/"$v"; [ -f "$o" ] || curl -o "$o" "http://i.imgur.com/$v"; done; }
youtube-dl(){ /usr/local/bin/youtube-dl --extract-audio --audio-format mp3 -o ~/Downloads/"$2.%(ext)s" "$1"; }
youtube-dl-v(){ /usr/local/bin/youtube-dl -o ~/Downloads/"$2.%(ext)s" "$1"; }
kc(){ sudo killall coreaudiod; }
############ nlog ############
nlog(){ f ~/file/history/text\ logs/nihil/; }
nlog₋₁(){ ql "$(ζ 'φ`~/file/history/text logs/nihil/*`.φs.sort()[-1]+""')"; }
nlog↩(){ mv ~/Downloads/{nlog\ *.json,201[6-9]-??-??T??:??:??*Z.png} ~/file/history/text\ logs/nihil/; }
##############################
ζlog(){ cat /usr/local/lib/node_modules/zeta-lang/log.txt; }
email(){ ζ '
	sfx`ack`
	sb().split(/\n{3,}/g).map(λ(ι){var [a,b,…c] = ι.split("\n"); c = c.join("\n"); ↩ ("mailto:"+a+"?subject="+b+"&body="+c).replace(/\n/g,"%0A")})
		.map(ι=> osaᵥ`chrome: open location ${ι}`)
	osaᵥ`chrome: activate`
	;'; }
alias ct=chrome_tabs; chrome_tabs(){ ζ '
	nice_ ← λ(title,url){t ← new String(title+" "+url); t.sourcemap = {title:[0,title.length], url:[(title+" ").length,(title+" "+url).length]}; ↩ nice_url(t)}
	var [title,url] = osaᵥ`chrome: get {title,URL} of tabs of windows`
	i ← ι
	if (i) {i = parseInt(i); t ← nice_(title[0][i],url[0][i]); p(t); ↩ t+"\n<copied>\n"}
	else {t ← _.zip(title,url).map(ι=> _.zip(…ι)).map(ι=> ι.map(ι=> nice_(…ι)).join("\n")).join("\n\n"); sb(t)}
	' "$1"; }
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
	disp ← ["",…";;;;#;;;;█;;;;#;;;;█"].join("-".repeat(9))
	o←; diy_stdin(λ(ι){ sfx`nacksoft`; if (!o) o = hrtime(); else process.stdout.write(disp.slice(0,floor((-o+(o=hrtime()))*100))+"\n")})
	;'; }
# document.write('<button id="pad" style="width:100%;height:100%;"></button>'); $('#pad').click((e)=>{ console.log('foo') })
cp_devi(){ rsync --protect-args --partial --progress --rsh=ssh 'alice@devi.xyz:/home/alice/'"$1" "$2"; }
ls_devi(){ ssh alice@devi.xyz 'find . -not -path "*/\\.*" -type f' | sort; }
push(){ ζ '
	//! the date code is borked

	get_day_in_year ← ι=> round( (ι - new Date(ι.getUTCFullYear(),0,0))/1e3 / 86400 ) - 1
	add_days ← (ι,x)=> Time(ι/1e3 + 86400*x)

	argv ← process.argv.slice(2)
	data ← φ`~/.scratch/a.json`.json || (φ`~/.scratch/a.json`.ι = {}); set_data = (k,ι)=>( data[k] = ι, φ`~/.scratch/a.json`.ι = data )

	label_fmt ← ι=> ("..."+ι).slice(-3)
	label_now ← ()=>{ t ← Time(); ↩ label_fmt(get_day_in_year(t) + (t.getUTCHours() < 10? -1 : -1)) }
	start ← Time(data.start)
	labels ← 180..map(ι=> label_fmt(get_day_in_year(add_days(start,ι))) )

	if (argv[1]){ ι = argv[1]; set_data(ι,!data[ι]) }

	color_now ← ι=> "\x1b[43m"+ι+"\x1b[0m"
	"5×5 pushups: "+start+"::->"+"\n"+
		labels.partition(floor(80/4)).map(ι=>{ var r = _.zip(…ι.map(ι=>{ t ← [ι, data[ι]?" ✓ ":" · "]; ι===label_now() && (t = t.map(color_now)); ↩ t })); ↩ r.map(ι=> ι.join(" ")).join("\n") }).join("\n")+"\n"
	' "$@"; }

############################# system configuration #############################
# &>/dev/null which brew || /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# &>/dev/null which realpath || { cd ~; git clone git@github.com:harto/realpath-osx.git && cd realpath-osx && make && cp realpath /usr/local/bin/ && cd .. && rm -rf realpath-osx; }

# # for v in {/,~/,~/Library/LaunchAgents/}{.[^.],}*; do [ -h "$v" ] && printf %s "$v"$'\t'; readlink "$v"; done
# sudo ln -sfh ~ /~
# # ln -sf ~/file/github/scratch/{spotiman,bandcamp-dl,dotfiles/{.bashrc,.keyrc}} ~/file/consume/books ~
# ln -sf ~/file/github ~/file/github/scratch/dotfiles/{.bashrc,.keyrc} ~/file/consume/books ~
# # ln -sf ~/books/#papers ~/papers
# # ln -sf ~/books/#misc/page_cache ~/pg
# ln -sf ~/file/github/scratch/LaunchAgents/* ~/Library/LaunchAgents/
# ln -sf ~/Library/Spelling/LocalDictionary ~/Library/'Application Support/Sublime Text 3'/Local ~/Library/'Application Support'/Google/Chrome/Default/Bookmarks ~/file/notes/#auto
# for v in ~/github/scratch/*; do [ -f "$v" ] && [ -x "$v" ] && ln -sf "$v" /usr/local/bin; done

# defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool false
# defaults write com.apple.loginwindow PowerButtonSleepsSystem -bool false
# defaults write com.apple.desktopservices DSDontWriteNetworkStores true
# duti -s com.sublimetext.3 public.plain-text all
# duti -s com.sublimetext.3 .md all

################################## deprecated ##################################
# ls|sbᵥ|… looks hard. a start: φ`/tmp/*`.φs.filter(ι=> /\/subl stdin /.λ(ι+''))._.sortBy(λ(ι){↩ ι.birthtime})[-1]
# cdw(){ local t="$(which "$1")"; [[ $? != 0 ]] && return 1; cd "$(realpath "$t/..")"; }

export NVM_DIR="/Users/home/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
