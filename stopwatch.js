#!/usr/bin/env node

// todo: if we're going to use a tmp, it should be in a sane dir

var exec = require('child_process').exec
var fs = require('fs')
var repl = require('repl')

alert = function(v,cb){exec('msg '+v,cb)}
copy = function(v){fs.writeFileSync('tmp',v); exec('clip < tmp',function(){fs.unlinkSync('tmp')})}
now = function(){return new Date()/1000}
print = console.log.bind(console)
Date.prototype.yyyy_mm_dd_hh_mm = function(){var M = this.getMonth()+1, d = this.getDate(), h = this.getHours(), m = this.getMinutes()+''; return this.getFullYear()+'-'+pad_left_2_0(M)+'-'+pad_left_2_0(d)+'/'+pad_left_2_0(h)+':'+pad_left_2_0(m)}

pad_left_2_0 = function(v){return (v<10?'0':'')+v}
pretty_time = function(v){var v = Math.round(v); var h = Math.floor(v/60/60); var m = Math.floor(v/60)%60; var s = v%60; return (h===0?'':pad_left_2_0(h)+'h')+pad_left_2_0(m)+'m'+pad_left_2_0(s)+'s'}
un_pretty_time = function(v){return v.match(/\d+\w/g).map(function(v){return parseInt(v.slice(0,-1)) * ({h:3600,m:60,s:1}[v.slice(-1)[0]])}).reduce(function(a,b){return a+b},0)}
number_to_word_20_99 = function(v){return ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'][Math.floor(v/10)] +
	(v%10===0?'':'-'+['','one','two','three','four','five','six','seven','eight','nine'][v%10])}

go = function λ(){
	if (λ.quit) λ.quit[0] = true
	var r = '@'+new Date().yyyy_mm_dd_hh_mm()+' '+pretty_time(now() - λ.now)+': '
	copy(r)
	λ.now = now()
	var quit = [false]; λ.quit = quit
	;(function t(times){var n = now(); times = times.filter(function(v){return !(v - n < 0)})
		if (times.length>0) setTimeout(function(){if (!quit[0]) alert("oh dude it's been like "+number_to_word_20_99(Math.round((now() - go.now)/60))+' minutes . finish up the thing?',function(){t(times.slice(1))})},(times[0] - n)*1000)
		})([20,30,40,50,60].map(function(v){return v*60 + go.now}))
	return r}
go.now = now()

repl.start({useGlobal:true})