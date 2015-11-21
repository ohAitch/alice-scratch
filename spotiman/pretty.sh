#!/usr/bin/env bash
cd $(dirname $(realpath "${BASH_SOURCE[0]}"))

sb(){ if [ -p /dev/fd/0 ]; then open -a "Sublime Text.app" -f; else if [[ $# = 0 ]]; then echo 'r = view.substr(view.full_line(sublime.Region(0,view.size())))' | curl -s -X PUT 127.0.0.1:34289 --data-binary @- | jq -r .; else /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "$@"; fi; fi; }

ζ -p "col ← λ(v){↩ v+' '.repeat(100-v.length)}; JSON.parse(fs('$(latest.sh)').$).map(λ(v){↩ col(v.artists._.map('name').join(' & ')+' ('+v.album.name+') - '+v.name)+' ∈ '+v.tags.join(', ')}).join('\n')" | sb
