#!/usr/bin/env bash
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
ζr() { ζ₂ -c "$1" .; exr "${1/.ζ₂/.js}" "${@:2}"; rm "${1/.ζ₂/.js}"; }

out=~/ali/history/auto/spotify/$(date_i).json
ζr main.ζ₂ backup > "$out"
echo "$out"
