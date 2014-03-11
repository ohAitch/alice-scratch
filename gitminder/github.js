#!/usr/bin/env node

var https = require('https')
var fs = require('fs')
var _ = require('./lib/underscore-min')

var user = 'alice0meta'
var Authorization = fs.readFileSync('Authorization')
var User_Agent = user

var print = console.log.bind(console)
Object.mapv = function(v,f){f = f || function(v){return [v,true]}; r = {}; v.forEach(function(v){t = f(v); if (t) r[t[0]] = t[1]}); return r}
function frequencies(v){var r = {}; v.forEach(function(v){r[v] = v in r? r[v]+1 : 1}); return r}
Date.prototype.hours = function(v){this.setHours(this.getHours()+v); return this}
Date.prototype.yyyy_mm_dd = function(){var m = (this.getMonth()+1)+''; var d = this.getDate()+''; return this.getFullYear()+'-'+(m[1]?m:'0'+m)+'-'+(d[1]?d:'0'+d)}

function header_links(v){return !v? {} : Object.mapv(v.split(',').map(function(v){return v.split(';').map(function(v){return v.trim()})}).map(function(v){return [v[1].match(/^rel="(.*)"$/)[1],v[0].match(/^<(.*)>$/)[1]]}),function(v){return v})}

function github(path,f){
	https.get({host:'api.github.com',path:(path[0] === '/'? path : path.match(/^https:\/\/api.github.com(.*)$/)[1]),
			headers:{'Authorization':Authorization,'User-Agent':User_Agent}
		},function(response){
			var t = ''
			response.on('data', function(chunk){t += chunk})
			response.on('end', function(chunk){print('--- fetched',Math.round(t.length/1024)+'kb','---','limit-remaining',response.headers['x-ratelimit-remaining'],'---'); f(JSON.parse(t),response)})
			}) }
function github_all_pages(path,f){var r = []; github(path,function λ(v,response){r = r.concat(v); var t = header_links(response.headers.link).next; if (t) github(t,λ); else f(r,response)})}
function github_all_commits(f) {
	github('/users/'+user+'/repos',function λ(v,response){
		var r = {}
		var repos = v.map(function(v){return v.name})
		repos.forEach(function(v,j){github_all_pages('/repos/'+user+'/'+v+'/commits',function(v){r[j] = v; if (_.range(0,repos.length).every(function(v){return r[v]})) {var t = []; for (var i=0;i<repos.length;i++) t = t.concat(r[i]); f(t)}})})
	}) }

github_all_commits(function(v){
	var dates = v.filter(function(v){return v.commit.author.name === user}).map(function(v){return v.commit.author.date}).sort()
	print(frequencies(dates.map(function(v){return new Date(v).hours(-3).yyyy_mm_dd()})))
})