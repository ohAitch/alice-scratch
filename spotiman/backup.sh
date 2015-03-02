#!/usr/bin/env bash
. ~/.bashrc

out=~/ali/history/auto/spotify/$(date_i).json
./main.sh backup > "$out"
echo "$out"
