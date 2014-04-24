pause() { read -p 'Press [Enter] to continue . . .'; }; export -f pause
export mydir='cd $(dirname "${BASH_SOURCE[0]}")'
#slash_fwd()  { echo $(echo "$1" | sed 's/\\/\//g'); }; export -f slash_fwd
#slash_back() { echo $(echo "$1" | sed 's/\//\\/g'); }; export -f slash_back

export PATH="/usr/local/bin:$PATH:."
#export PATH="$PATH:/c/Users/zii/ali/apps/#PATH:/c/Program Files/7-Zip:/c/Program Files/nodejs/:/c/Users/zii/AppData/Roaming/npm:/c/Users/zii/ali/apps/#PATH/mongodb-win32-x86_64-2008plus-2.6.0/bin:."
#export ALI="$(slash_fwd $USERPROFILE)/ali"
#export CLOJURE="$ALI/code/#libs/clojure-1.5.1/clojure-1.5.1-slim.jar"
#lwjgl_version=2.9.0
#export LWJGL="$ALI/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl-debug.jar;$ALI/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl_util.jar"
#export LWJGL_NATIVE="$ALI/code/#libs/lwjgl-$lwjgl_version/native/windows"
#export JAVA_LWJGL_NATIVE="-Djava.library.path=$LWJGL_NATIVE"
#export LOMBOK="$ALI/code/#libs/lombok.jar"

#export SSL_CERT_FILE="/c/Users/zii/ali/code/github/userscripts/bashrc/cacert.pem"

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # Load RVM function

export PS1='$(pwd)>'
f() { open .; }
x() { exit; }
sb() { "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" $@; }

command_not_found_handle() {
	if [ -f "$1.sh" ]; then "$1.sh" ${@:2}
	elif [ -d "$1" ]; then local t=`pwd`; cd "$1"; "run" ${@:2}; cd "$t"
	elif [ "$1" = "$" ]; then "run" ${@:2}
	else echo "-bash: $1: command not found"
	fi
}