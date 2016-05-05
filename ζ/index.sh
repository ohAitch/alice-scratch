#!/bin/bash
# a node 80/20 of https://github.com/martylamb/nailgun
__dirname # see compiler.js

# if [[ $1 = stop ]]; then kill -9 -$(/bin/ps opgid= 57802); exit; fi

# if ! [[ $1 = -b || $1 = -sb || ( ($1 = -p || $1 = --print || $1 = -e || $1 = --eval) && ($2 = \"-b\"* || $2 = \'-b\'*) ) ]]; then
	"$__dirname"/index.js "$@"
	exit
# fi

############### throw away when we have a replacement from mimic ###############
# is_sourced(){ [[ ${FUNCNAME[ (( ${#FUNCNAME[@]} - 1 ))]} = 'source' ]]; }
# exit_(){ if is_sourced; then return $1; else exit $1; fi; }
# if is_sourced; then { if [[ $BASH_VERSION = 3* ]]; then PID=$$; else PID=$BASHPID; fi; }; else PID=$PPID; fi

# DIR=/tmp/ζ_fast

# [ -e $DIR ] || { ( ( DIR=$DIR "$__dirname"/pool.ζ )&); while ! [ -e $DIR/.ready ]; do sleep 0.01; done; }
# tmp=$DIR/${PID}_
# for v; do v="${v//\\/\\\\\\\\}"; printf -- "${v//↩/\\␣}↩"; done > ${tmp}argv
# [ -p /dev/fd/0 ] && cat > ${tmp}in # probably does block
# echo $PID >> $DIR/queue
# if [[ $1 = -sb ]]; then exit_; fi # if silent
# kill -SIGSTOP $PID # sleep
# [ -e ${tmp}out ] && { read -r t < ${tmp}out; rm ${tmp}out; printf -- "$t"; }
# [ -e ${tmp}err ] && { read -r t < ${tmp}err; rm ${tmp}err; printf -- "$t" >&2; }
# [ -e ${tmp}status ] && { read -r t < ${tmp}status; rm ${tmp}status; exit_ $t; } || exit_ 0
################################################################################

# feature wishlist: totally transparently mimic ζ instead of using -b & "-b"
# feature wishlist: remove files you’re done with

# ooh, it might actually be easy to make the output streamed instead of buffered
# http://www.tldp.org/LDP/abs/html/io-redirection.html
# http://wiki.bash-hackers.org/syntax/redirection

#! important features:
# * compatible with sourcing
# * hardening against fucking up the pooled process
# * pool refreshing / management
# * fast

# if we go to sleep and the server’s down, then we’ll be waiting, which is why we need server management tools.

# current state: works! sort of. it keeps spawning new workers.
