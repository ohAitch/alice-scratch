#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || PATH="/usr/local/bin:$PATH"
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || PATH="./node_modules/.bin:$PATH:."

if [[ $PWD == /usr/local/lib/node_modules/* ]] && &>/dev/null which launchctl; then
	gcc -Wall -pedantic -O3 -o .bin/ipc_shell ipc_shell.c
	ζ --fresh '(φ.cwd+"").re`^/Users/` ? say`no` :
			os_daemon(φ.cwd.φ`server.ζ`).restart() ;'
fi
