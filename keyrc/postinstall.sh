#!/usr/bin/env bash
[[ $PATH =~ (^|:)\./node_modules/\.bin(:|$) ]] || export PATH="./node_modules/.bin:$PATH:."

npm -g ls | grep zeta || npm -g i zeta-lang

to='Hex Input +'; [[ $(set-input-source) = $to ]] || {
	eval "$(curl -sSL 'https://raw.githubusercontent.com/alice0meta/scratch/master/Hex%20Input%20%2B/install')"
	set-input-source -s "$to"
}

ζ ' keep_alive(φ`keyrc.ζ`.root("/")+"") ;'
