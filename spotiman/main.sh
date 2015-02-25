#!/usr/bin/env bash
. ~/.bashrc

nvm use 0.10 &>/dev/null

ζ₂ -c main.ζ₂ .
exr ./main.js "$@"
rm main.js
