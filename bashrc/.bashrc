pause() { read -p 'Press [Enter] to continue . . .'; }; export -f pause
export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
slash_fwd()  { echo $(echo "$1" | sed 's/\\/\//g'); }; export -f slash_fwd
slash_back() { echo $(echo "$1" | sed 's/\//\\/g'); }; export -f slash_back

export PATH="$PATH:/c/Users/zii/ali/apps/#PATH:/c/Program Files/7-Zip:."
export ALI="$(slash_fwd $USERPROFILE)/ali"
export CLOJURE="$ALI/code/#libs/clojure-1.5.1/clojure-1.5.1-slim.jar"
lwjgl_version=2.9.0
export LWJGL="$ALI/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl-debug.jar;$ALI/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl_util.jar"
export LWJGL_NATIVE="$ALI/code/#libs/lwjgl-$lwjgl_version/native/windows"
export JAVA_LWJGL_NATIVE="-Djava.library.path=$LWJGL_NATIVE"
export LOMBOK="$ALI/code/#libs/lombok.jar"

export PS1='$(pwd)>'
e() { explorer .; }
sb() { "C:\Program Files\Sublime Text 3\sublime_text.exe" $1; }

# command_not_found_handle seems broken
err_handle() {
	status=$?
	if [[ $status -ne 127 ]]; then return; fi
	lastcmd=$(history | tail -1 | sed 's/^ *[0-9]* *//')
	read cmd args <<< "$lastcmd"
	if [ -f "$cmd.sh" ]; then echo "running $cmd.sh"; "$cmd.sh" $args
	elif [ -d "$cmd" ] && [ -f "$cmd/run.sh" ]; then echo "running $cmd/run.sh"; local t=`pwd`; cd "$cmd"; "run.sh" $args; cd "$t"
	fi
}
trap 'err_handle' ERR