#!/usr/bin/env bash
sb() { if [ -t 0 ]; then /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; else open -a "Sublime Text.app" -f; fi; }

ζ₂ -e "col ← λ(v){↩ v+' '.repeat(100-v.length)}; JSON.parse(fs('$(latest.sh)').$).map(λ(v){↩ col(v.artists._.map('name').join(' & ')+' ('+v.album.name+') - '+v.name)+' ∈ '+v.tags.join(', ')}).join('\n')" | sb
