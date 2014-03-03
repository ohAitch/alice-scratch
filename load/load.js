#!/usr/bin/env node

//repl = require('repl')
fs = require('fs')
//main = require('./main')

//module.exports.hex = hex

var argv = process.argv.slice(2)

print = console.log.bind(console)
memoize_o = function(o,f){return function(v,b,c,d){return v in o? o[v] : (o[v] = f(v))}}
Object.map = function(v,f){f = f || function(v,b,c,d){return [v,b]}
	var r = {}; Object.keys(v).forEach(function(k){var t = f.call(v, k, v[k]); if (t) r[t[0]] = t[1]}); return r}
now = function(v,b,c,d){return Date.now() / 1000}
run = {
	in:   function(s,f){return {id:setTimeout( f,s*1000), cancel:function(v,b,c,d){return cancelTimeout( this.id)}}},
	every:function(s,f){return {id:setInterval(f,s*1000), cancel:function(v,b,c,d){return cancelInterval(this.id)}}},
	tomorrow:function(f){
		var start = new Date()
		var cancel = false
		var r = run.in(new Date(start).setHours(24,0,0,0)/1000 - start/1000,
			function t(){if (new Date().getDate() === start.getDate()) run.in(1,t); else {if (!cancel) f()}})
		return {cancel:function(){cancel = true; r.cancel()}}}
}

var pad_left = function(v,s,l){while (v.length < l) v = s + v; return v}
var hex = function(v,l){return pad_left(v.toString(16),'0',l)}

var js_short = {' ':'_', '!':'1', '#':'3', '%':'5', '&':'7', '(':'9', ')':'0', '*':'8', '+':'p', ',':'C', '-':'m', '.':'d', '/':'s', ':':'c', '=':'E', '?':'q', '@':'2', '[':'L', '\\':'b', '^':'6', '`':'k', '{':'B', '|':'o', '~':'t', '…':'r', '←':'w', '→':'e', '¬':'n', '∀':'A', '≠':'N', 'ǂ':'ǂ', '<':'lt', '≤':'le', '>':'gt', '≥':'ge'}
var js_encode_short = Object.map(js_short,function(v,b,c,d){return [v,'ǂ'+b]})
var js_decode_short = Object.map(js_short,function(v,b,c,d){return [b,v]})
var js_symbol_start = memoize_o({';':false,' ':false,'ǂ':false},function(v){try {eval('var '+v)} catch (e) {return false} return true})
var js_symbol_part = function(v){if (v === ';'||v === ' '||v === 'ǂ') return false; try {eval('var a'+v)} catch (e) {return false} return true}
var js_encode_char = memoize_o(js_encode_short, function(v){return js_symbol_part(v)? v : 'ǂx'+hex(v.charCodeAt(0),4)})
js_encode_symbol = memoize_o({},function(v){var r = v.split('').map(js_encode_char).join(''); return js_symbol_start(r[0])? r : 'ǂ'+r})
js_decode_symbol = memoize_o({},function(v){
	v = v[0]=== 'ǂ'? v.slice(1) : v
	var r = ''; var i; while ((i=v.indexOf('ǂ')) !== -1) {
		r += v.slice(0,i); v = v.slice(i+1)
		if (v[0] === 'x') {r += String.fromCharCode(parseInt(v.slice(1,5),16)); v = v.slice(5)}
		else if (v[0] === 'l' || v[0] === 'g')  {r += js_decode_short[v.slice(0,2)]; v = v.slice(2)}
		else {r += js_decode_short[v[0]]; v = v.slice(1)}
		} return r+v})

compile_lang_s = function(s){
	return s
		.replace(/\\\n(.*?)(?=\n)/g,'$1\n')
		.replace(/λ\{/g,'function(v,b,c,d){return ')
		.replace(eval('/λ'+'(?![\'\\\\])/g'),'function')
		.replace(eval('/([^?+])='+'(?![\'=\\\\])/g'),'$1===')
		.replace(eval('/←'+'(?!\')/g'),'=')
		.replace(eval('/≠'+'(?!\')/g'),'!==')
		.replace(eval('/≤'+'(?!\')/g'),'<=')
		.replace(eval('/≥'+'(?!\')/g'),'>=')
		.replace(eval('/¬'+'(?!\')/g'),'!')
}
compile_lang_f = function(f){fs.writeFileSync('bin/'+f.replace('.α','.js'),compile_lang_s(fs.readFileSync(f).toString()))}

compile_lang_f(argv[0].replace('.a','.α'))

/*
reader_macro('"', <string reader>)
reader_macro(['~/'], <regex reader>)
reader_macro(['//'], <eat all characters through eof|'\n'|'\r', return space>)
reader_macro(' \t\n\r\x0b\x0c', <return space>)
# and combine all spaces to a single space?
reader_macro(['~@']+list('()[]{}‹›.`~,;'), <return self as a symbol (operator)>)
reader_macro('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$%', <eat all characters with same reader macro, return as a symbol (word)>)
reader_macro('', <eat all characters with same reader macro, return as a symbol (operator)>)

# SPACE === symbol('')
# and then strip whitespace
# for tokens, detect space-operator-space space-operator operator-space operator, tag as 'space_both' 'space_after' 'space_before' 'space_neither'

# and then make groups:
for v in ['()','[]','{}','‹›']: reader_group(v)

# oh dear. we forgot about semicolon insertion slash newlines, {} blocks, and line number preservation
# or, don't have those four categories; just convert space before and space after into prefix and postfix (or: do this only at a later level)

so it looks like (1) comma and semicolon may as well be synonymous and (2)

known multileft: pythonic for
but that's not actually multileft. you can implement that by just letting () and [] know that they might be generators.

# http://es5.github.io/
# we have left it unclear what exactly the goal is, and i believe we may be suffering from scope creep http://publications.gbdirect.co.uk/c_book/chapter7/how_the_preprocessor_works.html




cpp

#define (you can comment out newlines with a backslash)
#include (<header>, "file")
#if elif else ifdef ifndef (taking in constant expressions with arithmetical operators, and taking in definedness)

i want

#require
possibly a #use like thing but that probably should not be a primitive?

#define name tokens
#define name(comma, separated, list) tokens
#define name[comma, separated, list] tokens
#define name[comma, separated, list] tokens
*/