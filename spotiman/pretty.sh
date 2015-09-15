#!/usr/bin/env bash
t="${BASH_SOURCE[0]}"; while [ -h "$t" ]; do d="$(cd -P "$(dirname "$t")" && pwd)"; t="$(readlink "$t")"; [[ $t != /* ]] && t="$d/$t"; done; cd -P "$(dirname "$t")" # cd directory of this file

sb() { if [ -t 0 ]; then /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; else open -a "Sublime Text.app" -f; fi; }

ζ₂ -e "col ← λ(v){↩ v+' '.repeat(100-v.length)}; JSON.parse(fs('$(latest.sh)').$).map(λ(v){↩ col(v.artists._.map('name').join(' & ')+' ('+v.album.name+') - '+v.name)+' ∈ '+v.tags.join(', ')}).join('\n')" | sb
