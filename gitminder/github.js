#!/usr/bin/env node

// this is fairly poorly written . notably, it is not-quite-javascript written in javascript, and it doesn't really follow node convention

// each run, grabs about 0.6mb from github and 10kb from beeminder, with my settings

// issues:
// may break on really unusual timezones
// will break on commits to repos you don't own
// doesn't track non-commits
// fetched-kb may break on unicode

var http = require('http')
var https = require('https')
var fs = require('fs')
var _ = require('./lib/underscore-min')

var user = 'alice0meta'
var goal = 'c0d3z'
var auth = JSON.parse(fs.readFileSync('auth.json'))

// from lang-alpha
var print = console.log.bind(console)
Object.mapv = function(v,f){f = f || function(v){return [v,true]}; r = {}; v.forEach(function(v){t = f(v); if (t) r[t[0]] = t[1]}); return r}
var merge_o = function(a,b){var r = {}; Object.keys(a).forEach(function(k){r[k] = a[k]}); Object.keys(b).forEach(function(k){r[k] = b[k]}); return r}
var seq = function(v){return typeof v === 'string'? v.split('') : v instanceof Array? v : Object.keys(v).map(function(k){return [k,v[k]]})}
var pad_left = function(v,s,l){while (v.length < l) v = s + v; return v}

function frequencies(v){var r = {}; v.forEach(function(v){r[v] = v in r? r[v]+1 : 1}); return r}
function dict_by(sq,f){var r = {}; for(var i=0;i<sq.length;i++) r[f(sq[i])] = sq[i]; return r}
Date.prototype.hours = function(v){this.setHours(this.getHours()+v); return this}
Date.prototype.yyyy_mm_dd = function(){var m = (this.getMonth()+1)+''; var d = this.getDate()+''; return this.getFullYear()+'-'+(m[1]?m:'0'+m)+'-'+(d[1]?d:'0'+d)}
function guid(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){var r = Math.random()*16|0; return (c === 'x' ? r : (r&0x3|0x8)).toString(16)})}

function header_links(v){return !v? {} : Object.mapv(v.split(',').map(function(v){return v.split(';').map(function(v){return v.trim()})}).map(function(v){return [v[1].match(/^rel="(.*)"$/)[1],v[0].match(/^<(.*)>$/)[1]]}),function(v){return v})}
function request(path,query,headers,f,base){
	var t = path.match(/^([A-Z]+) (.*)$/); var method = t? t[1] : 'GET'; path = t? t[2] : path
	path = path.indexOf(base) === 0? path : base+path
	t = path.match(/^(https?):\/\/(.*)$/); var http_ = t[1] === 'http'? http : https; path = t[2]
	t = path.match(/^(.*?)(\/.*)$/); var host = t[1]; path = t[2]
	query = seq(query).map(function(v){return v[0]+'='+v[1]}).join('&')
	path = path+(query===''?'':'?'+query)
	http_.request({host:host,path:path,headers:headers,method:method},function(response){
		var r = []; response.on('data', function(chunk){r.push(chunk)}); response.on('end', function(){
			r = r.join('')
			var t = ['---','fetched',pad_left(Math.round(r.length/1024)+'kb',' ',5),'---','from',host,'---']; var u = response.headers['x-ratelimit-remaining']; if (u) t.push('limit-remaining',u,'---'); print(t.join(' '))
			f(JSON.parse(r),response) }) }).end()}

function github(path,f){request(path,{},{'Authorization':auth.github,'User-Agent':user},f,'https://api.github.com')}
function github_all_pages(path,f){var r = []; github(path,function λ(v,response){r = r.concat(v); var t = header_links(response.headers.link).next; if (t) github(t,λ); else f(r,response)})}
function github_all_commits(f) {
	github('/users/'+user+'/repos',function λ(v,response){
		var r = {}
		var repos = v.map(function(v){return v.name})
		repos.forEach(function(v,j){github_all_pages('/repos/'+user+'/'+v+'/commits',function(v){r[j] = v; if (_.range(0,repos.length).every(function(v){return r[v]})) {var t = []; for (var i=0;i<repos.length;i++) t = t.concat(r[i]); f(t)}})})
	}) }

function beeminder(path,query,f){request(path,merge_o({auth_token:auth.beeminder},query),{},f,'https://www.beeminder.com/api/v1')}
function beeminder_get(f){beeminder('/users/me/goals/'+goal+'/datapoints.json',{},f)}
function beeminder_add(v){beeminder('POST /users/me/goals/'+goal+'/datapoints/create_all.json',{datapoints:JSON.stringify(v instanceof Array? v : [v])},function(v){print('beeminder_add returned:',v)})}
function beeminder_delete(ids){(ids instanceof Array? ids : [ids]).map(function(id){beeminder('DELETE /users/me/goals/'+goal+'/datapoints/'+id+'.json',{},function(v){print('beeminder_delete returned:',v)})})}

github_all_commits(function(v){
	var dates = v.filter(function(v){return v.committer.login === user}).map(function(v){return v.commit.author.date}).sort()
	var dates = frequencies(dates.map(function(v){return new Date(v).hours(-3).yyyy_mm_dd()}))
	//print(dates)
	beeminder_get(function(v){
		// bee warned, arbitrary hacks lie here
		var beedays = v.filter(function(v){return v.comment !== 'temp'}).map(function(v){return [new Date(v.timestamp*1000).yyyy_mm_dd(), v.value, v.id]})
		var beedict = dict_by(beedays,function(v){return v[0]})
		//print(beedays)
		beedays.map(function(v){if (v[1] !== dates[v[0]]) {print('discrepancy:',v) }})//; beeminder_delete(v[2])}})
		Object.keys(dates).map(function(k){if ("2014-03-10" <= k && !beedict[k]) {print('missing',k,dates[k]); beeminder_add({timestamp:new Date(k).hours(12)/1000,value:dates[k],comment:'auto-entered by aligitminder'})}})
	})
})