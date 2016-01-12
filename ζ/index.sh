#!/usr/bin/env bash
__dirname(){ dirname $(/usr/local/bin/realpath "${BASH_SOURCE[0]}"); }

# really the idea here is to pool processes. would be ideal to make this as utterly transparent as possible. i wonder if we could just start an initial process and fork it to add it to the pool?

# bugs:
# loses return codes
# is single-threaded

# todo:
# should try to always have an idle process ready, so that ζ commands can always execute in 0ms

PORT=33710
node='/usr/local/bin/node --harmony --harmony_destructuring --harmony_default_parameters --harmony_reflect --harmony_regexps --harmony_proxies --harmony_unicode_regexps'

if [[ $1 = -p || $1 = --print || $1 = -e || $1 = --eval ]]; then
	fs_ipc_emit(){ echo "$2" > "/tmp/fs_ipc_$1"; curl -s -X PUT "127.0.0.1:$1"; }
	[ -p /dev/fd/0 ] && cat > "/tmp/fs_ipc_${PORT}_stdin"

	fs_ipc_emit $PORT "$*"
	if [[ $? = 7 ]]; then # 7: CURLE_COULDNT_CONNECT
		($node "$(__dirname)/bootstrap.js" -e '"uqo4hqvayc3m1jor"; fs_ipc.on('"$PORT"',λ(ι){if (ι === "\n") ↩; ζ_main(/^(\S+) ([\s\S]+)$/.λ(ι).slice(1))})' &) &>/dev/null
		while ! fs_ipc_emit $PORT ""; do sleep 0.005; done
		fs_ipc_emit $PORT "$*"
		fi
else
	$node "$(__dirname)/bootstrap.js" "$@"
fi
