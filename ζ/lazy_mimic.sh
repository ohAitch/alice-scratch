#!/usr/bin/env bash
[[ $PATH =~ (^|:)/usr/local/bin(:|$) ]] || export PATH="/usr/local/bin:$PATH"
__dirname="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

"$__dirname"/server.ζ >> "$__dirname"/log.txt 2>&1 &
ln -sf "$__dirname"/bin/mimic "$__dirname"/bin/ζλ
ζ "$@"

#! bug: doesn't know to switch self out after a reboot
