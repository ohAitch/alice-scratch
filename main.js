#!/usr/bin/env node

repl = require('repl')
fs = require('fs')
main = require('./main')

//module.exports.hex = hex

var argv = process.argv.slice(2)

print = function(v){console.log(v)}
memoize_o = function(o,f){return function(v){return v in o? o[v] : (o[v] = f(v))}}
Object.map = function(v,f){f = f || function(k,v){return [k,v]}
    var r = {}; Object.keys(v).forEach(function(k){var t = f.call(v, k, v[k]); if (t) r[t[0]] = t[1]}); return r}
now = function(){return Date.now() / 1000}
run = {
	in:   function(s,f){return {id:setTimeout( f,s*1000), cancel:function(){cancelTimeout( this.id)}}},
	every:function(s,f){return {id:setInterval(f,s*1000), cancel:function(){cancelInterval(this.id)}}},
	tomorrow:function(f){
		var start = new Date()
		var cancel = false
		var r = run.in(new Date(start).setHours(24,0,0,0)/1000 - start/1000,
			function t(){if (new Date().getDate() === start.getDate()) run.in(1,t); else {if (!cancel) f()}})
		return {cancel:function(){cancel = true; r.cancel();}}}
}

var pad_left = function(v,s,l){while (v.length < l) v = s + v; return v}
var hex = function(v,l){return pad_left(v.toString(16),'0',l)}

var js_short = {' ':'_', '!':'1', '#':'3', '%':'5', '&':'7', '(':'9', ')':'0', '*':'8', '+':'p', ',':'C', '-':'m', '.':'d', '/':'s', ':':'c', '=':'E', '?':'q', '@':'2', '[':'L', '\\':'b', '^':'6', '`':'k', '{':'B', '|':'o', '~':'t', '…':'r', '←':'w', '→':'e', '¬':'n', '∀':'A', '≠':'N', 'ǂ':'ǂ', '<':'lt', '≤':'le', '>':'gt', '≥':'ge'}
var js_encode_short = Object.map(js_short,function(k,v){return [k,'ǂ'+v]})
var js_decode_short = Object.map(js_short,function(k,v){return [v,k]})
var js_symbol_start = memoize_o({';':false,' ':false,'ǂ':false},function(v){try {eval('var '+v)} catch (e) {return false} return true})
var js_symbol_part = function(v){if (v===';'||v===' '||v==='ǂ') return false; try {eval('var a'+v)} catch (e) {return false} return true}
var js_encode_char = memoize_o(js_encode_short, function(v){return js_symbol_part(v)? v : 'ǂx'+hex(v.charCodeAt(0),4)})
js_encode_symbol = memoize_o({},function(v){var r = v.split('').map(js_encode_char).join(''); return js_symbol_start(r[0])? r : 'ǂ'+r})
js_decode_symbol = memoize_o({},function(v){
	v = v[0]==='ǂ'? v.slice(1) : v
	var r = ''; var i; while ((i=v.indexOf('ǂ')) !== -1) {
		r += v.slice(0,i); v = v.slice(i+1)
		if (v[0] === 'x') {r += String.fromCharCode(parseInt(v.slice(1,5),16)); v = v.slice(5)}
		else if (v[0] === 'l' || v[0] === 'g')  {r += js_decode_short[v.slice(0,2)]; v = v.slice(2)}
		else {r += js_decode_short[v[0]]; v = v.slice(1)}
		} return r+v})

/*
	var tasks = {}
	checkFile = function (f) {
		// create a pattern to match on
		var pattern = /(todo|fixme|optimise|optimize)\W*(.*$)/i
		var items = []
		var lineNumber = 1
		file = fs.readFileSync(f).toString().split('\n')
		file.forEach(function (line) {
			if (match = line.match(pattern)) {
				items.push(" * [" + lineNumber.toString() + "] " + match[1].toUpperCase() + ": " + match[2])
			}
			lineNumber++
		})
		if (items.length > 0) { // Output the file name
			console.log(f) // Output the matches
			items.forEach(function (item) {
				console.log(item)
			})
		}
	}
	tasks.search = function (dir, action) { // Assert that it's a function
		if (typeof action !== "function") action = function (error, file) {} // Read the directory
		fs.readdir(dir, function (err, list) { // Return the error if something went wrong
			if (err) return action(err) // For every file in the list
			list.forEach(function (file) { // Full path of that file
				var path = dir + "/" + file // Get the file's stats
				fs.stat(path, function (err, stat) {
					//console.log(path + " is a file? " + stat.isFile())
					// If the item is a directory
					if (stat && stat.isDirectory()) {
						tasks.search(path, action)
					} else if (stat && stat.isFile()) {
						checkFile(path)
					} else {
						action(null, path)
					}
				})
			})
		})
	}
	// If no arguments are passed, pass the current directory
	if (typeof argv[0] === "undefined" || argv[0] === null) {
		argv[0] = "."
	}
	if (argv[0] === "--help" || argv[0] === "-h") {
		console.log("usage: net-notes [options] \n\n" + "Searches files for TODO, FIXME or OPTIMISE tags within your project,\n" + "displaying the line number and file name along with the tag description\n" + "options:\n" + "[directory_name] # Optional parameter, will run from current directory\n" + "-h, [--help] # Show this help message and quit")
	} else {
		tasks.search(argv[0])
	}

	var ExtendedMath
	ExtendedMath = (function () {
		var ExtendedMath = function() {}
		// TODO: Allow number to be passed in to call square root on
		ExtendedMath.prototype.root = function () {
			return Math.sqrt
		}
		//FIXME: Squaring currently cubes the result which is incorrect
		ExtendedMath.prototype.square = function (x) {
			return square(x) * x
		}
		ExtendedMath.prototype.cube = function (x) {
			return x * square(x)
		}
		//TODO: Add fix for JavaScript floating point calculations
		return ExtendedMath
	})()
	*/

//repl.start({useGlobal:true})