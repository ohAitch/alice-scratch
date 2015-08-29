#!/usr/bin/env bash
date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
ζr() { ζ₂ -c "$1" .; exr "${1/.ζ₂/.js}" "${@:2}"; rm "${1/.ζ₂/.js}"; }

ζr main.ζ₂ backup > $(cat to.txt)/$(date_i).json
