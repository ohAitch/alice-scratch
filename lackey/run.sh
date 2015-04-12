#!/usr/bin/env bash
ζr() { ζ₂ -c "$1" .; exr "${1/.ζ₂/.js}" "${@:2}"; rm "${1/.ζ₂/.js}"; }

cp lackey.icns ~/"Library/Keyboard Layouts/"
ζr make_keylayout.ζ₂ ~/"Library/Keyboard Layouts/lackey.keylayout"

ζr make_karab.ζ₂ monday.lackey ~/"Library/Application Support/Karabiner/private.xml"
/Applications/Karabiner.app/Contents/Library/bin/karabiner reloadxml
/Applications/Karabiner.app/Contents/Library/bin/karabiner enable lackey
