#!/usr/bin/env bash
D() { [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }
npmi() { mv package.json $(D npm_inc_tmp); cd npm_inc_tmp; npm version patch; mv package.json ..; cd ..; rmdir npm_inc_tmp; }

# if versions are equal:
# global.cmp_versions = λ(cb){
# 	version_lt ← λ(a,b){a=a.split('.').map(i); b=b.split('.').map(i); ↩ a[0]<b[0] || (a[0]===b[0] && (a[1]<b[1] || (a[1]===b[1] && a[2]<b[2])))}
# 	local ← JSON.parse(fs('package.json').$)
# 	exec("curl -L '"+'https://raw.github.com/'+local.repository.url.match(/^https:\/\/github.com\/([\w-]+\/[\w-]+)\.git$/)[1]+'/master/package.json'+"'",λ(e,v){canon←;;
# 		if (v!=='' && (canon = JSON.parse(v), version_lt(local.version,canon.version))) cb(null,local.version+' → '+canon.version)
# 		else cb()
# 	}) }
# then increment patch by 1

[[ $1 ]] || npmi
npm publish .
sleep 0.1
npm install zeta-two -g
