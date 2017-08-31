#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."

if [[ $PWD == /usr/local/lib/node_modules/* ]] && &>/dev/null which launchctl; then
	gcc -Wall -pedantic -O3 -o .bin/ipc_shell ipc_shell.c
	ζ --fresh '
		(φ.cwd+"").re`^/Users/` ? hsᵥ`hs.alert("no")` :
			os_daemon(φ.cwd.φ`server.ζ`).restart() ;'
	sleep 1 # wtf (prevents this error /usr/local/lib/node_modules/zeta-lang/.bin/ipc_shell:1 / (function (exports, require, module, __filename, __dirname) { ����)
fi
