#!/usr/bin/env node

var exec = require('child_process').exec
var fs = require('fs')

alert = function(v){exec('msg '+v)}
copy = function(v){fs.writeFileSync('tmp',v); exec('clip < tmp',function(){fs.unlinkSync('tmp')})}
now = function(){return new Date()/1000}
print = console.log.bind(console)
Date.prototype.yyyy_mm_dd_hh_mm = function(){var M = this.getMonth()+1, d = this.getDate(), h = this.getHours(), m = this.getMinutes()+''; return this.getFullYear()+'-'+pad_left_2_0(M)+'-'+pad_left_2_0(d)+'/'+pad_left_2_0(h)+':'+pad_left_2_0(m)}

pad_left_2_0 = function(v){return (v<10?'0':'')+v}
pretty_time = function(v){var v = Math.round(v); var h = Math.floor(v/60/60); var m = Math.floor(v/60)%60; var s = v%60; return (h===0?'':pad_left_2_0(h)+'h')+pad_left_2_0(m)+'m'+pad_left_2_0(s)+'s'}
un_pretty_time = function(v){return v.match(/\d+\w/g).map(function(v){return parseInt(v.slice(0,-1)) * ({h:3600,m:60,s:1}[v.slice(-1)[0]])}).reduce(function(a,b){return a+b},0)}

//go = function λ(results,plan,time){results = results||''; plan = plan||''
go = function λ(){
	clearTimeout(λ.alert)
	//var t = pretty_time(now() - λ.now)
	λ.alert = setTimeout(function(){alert("oh dude it's been like thirty minutes . you should probably finish up the thing")},30*60*1000)
	//if (time) λ.alert = setTimeout(function(){alert('hey! end this span already! it\'s been '+t)},time*1000)
	var r = '@'+new Date().yyyy_mm_dd_hh_mm()+' '+pretty_time(now() - λ.now)+': '
	//copy('\t'+r+'\n\t'+': '+plan+' /'+'\n')
	copy(r)
	//λ.plan = plan
	λ.now = now()
	return r}

/*
node
require('./stopwatch')
go()

*/