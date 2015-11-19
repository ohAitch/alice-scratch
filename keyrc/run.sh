#!/usr/bin/env bash
-q(){ "$@" &>/dev/null; }
ζr(){ -q pushd $(dirname "$1"); ζ₂ -c "$1" .; -q popd; chmod +x "${1/.ζ₂/.js}"; "${1/.ζ₂/.js}" "${@:2}"; E=$?; rm "${1/.ζ₂/.js}"; return $E; }

cp lackey.icns ~/Library/Keyboard\ Layouts/ &&
ζr make_keylayout.ζ₂ ~/Library/Keyboard\ Layouts/lackey.keylayout &&
ζr make_karab.ζ₂ default.lackey ~/Library/Application\ Support/Karabiner/private.xml
