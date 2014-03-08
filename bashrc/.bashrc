export PATH=$PATH:.
export PS1='$(pwd)>'

LWJGL_VERSION=2.9.0
export ALI="$USERPROFILE/ali"
export CLOJURE="$ALI/code/#libs/clojure-1.5.1/clojure-1.5.1-slim.jar"
export LWJGL="$ALI/code/#libs/lwjgl-$LWJGL_VERSION/jar/lwjgl-debug.jar;$ALI/code/#libs/lwjgl-$LWJGL_VERSION/jar/lwjgl_util.jar"
export LWJGL_NATIVE="$ALI/code/#libs/lwjgl-$LWJGL_VERSION/native/windows"
export JAVA_LWJGL_NATIVE="-Djava.library.path=$LWJGL_NATIVE"
export LOMBOK="$ALI/code/#libs/lombok.jar"

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