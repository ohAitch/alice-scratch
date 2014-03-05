#!/usr/bin/env node
//__literal__('#!/usr/bin/env node')

var fs = require('fs')
var _ = require('../lib/underscore-min')




var print = console.log.bind(console)
var memoize_o = function λ(o,f){return function λ(v){var r = own(o,v); return r === undefined? (o[v] = f(v)) : r}}
var merge_o = function λ(a,b){for (k in b) a[k] = b[k]; return a}
Object.map = function λ(v,f){var f = f || function λ(v,b,c){return [v,b]}; var r = {}; Object.keys(v).forEach(function λ(k){var t = f.call(v, k, v[k]); if (t) r[t[0]] = t[1]}); return r}
Object.mapv = function λ(v,f){var f = f || function λ(v,b,c){return [v,true]}; var r = {}; v.forEach(function λ(v){var t = f(v); if (t) r[t[0]] = t[1]}); return r}
var now = function λ(v,b,c){return Date.now() / 1000}
var run = {
in: function λ(s,f){return {id:setTimeout( f,s*1000), cancel:function λ(v,b,c){return cancelTimeout( this.id)}}},
every:function λ(s,f){return {id:setInterval(f,s*1000), cancel:function λ(v,b,c){return cancelInterval(this.id)}}},
tomorrow:function λ(f){
var start = new Date()
var cancel = false
var r = run.in(new Date(start).setHours(24,0,0,0)/1000 - start/1000,
function λ(){if (new Date().getDate() === start.getDate()) run.in(1,λ); else {if (!cancel) f()}})
return {cancel:function λ(){cancel = true; r.cancel()}}}}

var ord = function λ(v,b,c){return v.charCodeAt(0)}
var chr = function λ(v,b,c){return String.fromCharCode(v)}
var seq = function λ(v,b,c){return typeof v === 'string'? v.split('') : v}
var extend_function = function λ(f){var r = function λ(){var r = f(); r.__proto__ = λ.prototype; return r}; r.prototype.__proto__ = Function.prototype; return r}
var own = function λ(o,m){if (Object.prototype.hasOwnProperty.call(o,m)) return o[m]}
var delset = function λ(o,m,v){if (v === undefined) delete o[m]; else o[m] = v}
String.prototype.repeat = function λ(v,b,c){return new Array(v+1).join(this)}



var pad_left = function λ(v,s,l){while (v.length < l) v = s + v; return v}
var hex = function λ(v,l){return pad_left(v.toString(16),'0',l)}
var js_valid_symbol = new (function λ(){
var _short = {' ':'_', '!':'1', '#':'3', '%':'5', '&':'7', '(':'9', ')':'0', '*':'8', '+':'p', ',':'C', '-':'m', '.':'d', '/':'s', ':':'c', '=':'E', '?':'q', '@':'2', '[':'L', '\\':'b', '^':'6', '`':'k', '{':'B', '|':'o', '~':'t', '\u2026':'r', '\u2190':'w', '\u2192':'e', '\u00ac':'n', '\u2200':'A', '\u2260':'N', '\u01c2':'\u01c2', '<':'lt', '\u2264':'le', '>':'gt', '\u2265':'ge'}
var encode_short = Object.map(_short,function λ(v,b,c){return [v,'\u01c2'+b]})
var decode_short = Object.map(_short,function λ(v,b,c){return [b,v]})
var is_start = memoize_o(Object.mapv(seq(';\u01c2 \t\n\u000b\u000c\u000d'),function λ(v,b,c){return [v,false]}),function λ(v){try {eval('var '+v )} catch (e){return false} return true})
var is_part = memoize_o(Object.mapv(seq(';\u01c2 \t\n\u000b\u000c\u000d'),function λ(v,b,c){return [v,false]}),function λ(v){try {eval('var a'+v)} catch (e){return false} return true})
var encode_char = memoize_o(encode_short, function λ(v){return is_part(v)? v : '\u01c2u'+hex(ord(v),4)})

var keywords = ['break','do','instanceof','typeof','case','else','new','var','catch','finally','return','void','continue','for','switch','while','debugger','function','this','with','default','if','throw','delete','in','try','class','enum','extends','super','const','export','import','implements','let','private','public','yield','interface','package','protected','static']
var encode_keywords = merge_o(Object.mapv(keywords,function λ(v,b,c){return [v,'_'+v]}), Object.mapv(keywords,function λ(v,b,c){return ['_'+v,'\u01c2_'+v]}))
var decode_keywords = Object.map(encode_keywords,function λ(v,b,c){return [b,v]})
this.is_part = is_part
this.encode = memoize_o(encode_keywords,function λ(v){var r = seq(v).map(encode_char).join(''); return is_start(r[0])? r : '\u01c2'+r})
this.decode = memoize_o(decode_keywords,function λ(v){
var v = v[0] === '\u01c2'? v.slice(1) : v
var r = ''; var i=null; while ((i=v.indexOf('\u01c2')) !== -1){
r += v.slice(0,i); v = v.slice(i+1)
if (v[0] === 'u'){r += chr(parseInt(v.slice(1,5),16)); v = v.slice(5)}
else if (v[0] === 'l' || v[0] === 'g'){r += decode_short[v.slice(0,2)]; v = v.slice(2)}
else {r += decode_short[v[0]]; v = v.slice(1)}}
return r+v})})




var Symbol = function λ(v,line){this.v = v; if (line) this.line = line}
Symbol.prototype.space_before = false
Symbol.prototype.space_after = false
var S = function λ(v,line){return new Symbol(v,line)}
var SP = {}


var js_valid_symbol_encode = function λ(v,b,c){return own({'=':'===','\u2190!':'=','\u2190':'=','\u2260':'!==','\u2264':'<=','\u2265':'>=','\u00ac':'!','\u208b\u2081':'.slice(-1)[0]','\u2080':'[0]','\u2081':'[1]','\u2082':'[2]','\u2083':'[3]','ᵥ':'[v]','ᵢ':'[i]','ₖ':'[k]','ₘ':'[m]'},v) || (own(Object.mapv('< > , . : ; + - * / || && ? += ++ if else for return in new typeof delete try catch while this instanceof switch case throw break continue'.split(' ')),v)?v:null) || (v.match(/^\d/)?v:null) || js_valid_symbol.encode(v)}
var split_symbol = function λ(l,s){var r = [[]]; l.map(function λ(v){if (v instanceof Symbol && v.v === s) r.push([]); else r.slice(-1)[0].push(v)}); return r}
var ran_as = process.argv[1].match(/[^\\]*\\[^\\]*$/)[0]
var pr = function λ(){if (ran_as === 'bin\\load.js') print.apply(this,['##'].concat(arguments)); return arguments[0]}
Array.prototype.map2 = function λ(f){var r = []; if (this.length===0) return r; for (var i=0;i<this.length-1;i++) r.push(f(this[i],this[i+1])); r.push(f(this.slice(-1)[0],null)); return r}
Symbol.prototype.spa = function λ(){this.space_after = true; return this}

var printable = function λ(v,b,c){return (0x20<=ord(v) && ord(v)<0x7f) || js_valid_symbol.is_part(v)}

var repr_js = function λ(v,line,next){var mrj = function λ(v,b,c){return v.map2(function λ(v,b,c){return repr_js(v,line,b)}).join('')}; var t=null;
return v instanceof Symbol? (v.line && line? '\n'.repeat(function λ(v){line[0] += v; return v}(Math.max(0, v.line-line[0]))) : '') + (
v.space_before?' ':'') + (
next instanceof Symbol && next.v === '\u2190'? 'var ' : '') + ((
v.v === 'λ' && (next instanceof Array && next[0].v === '('))? 'function λ' : (
v.v === 'λ' && (next instanceof Array && next[0].v === '{'))? function λ(r){next.splice(1,0,S('return').spa()); return r}('function λ'+'(v,b,c)') :
js_valid_symbol_encode(v.v))
+ (
v.space_after && !(next instanceof Symbol && next.space_before)?' ':'') :
v instanceof Array?
v[0].v === '[' && !v[0].space_before && v.some(function λ(v,b,c){return v instanceof Symbol && v.v === ':'})? '.slice('
+((t = [(t = split_symbol(v.slice(1),':'))[0].length === 0? [S('0')] : t[0], t[1]])[1].length === 0? mrj(t[0]) : t.map(mrj).join(','))+')' :
v[0].v + mrj(v.slice(1)) + groups[v[0].v] :
typeof v === 'string'? (v.match(/'/g)||[]).length <= (v.match(/"/g)||[]).length? "'"
+seq(v).map(function λ(v,b,c){return {"'":"\\'",'\n':'\\n','\t':'\\t','\\':'\\\\'}[v] || (printable(v)? v : '\\u'+hex(ord(v),4))}).join('')+"'" : '"'
+seq(v).map(function λ(v,b,c){return {'"':'\\"','\n':'\\n','\t':'\\t','\\':'\\\\'}[v] || (printable(v)? v : '\\u'+hex(ord(v),4))}).join('')+'"' :
v instanceof RegExp? v+'' : '<what:'
+v+'>'}
var repr_js_file = function λ(forms){var mrj = function λ(v,b,c){return v.map2(function λ(v,b,c){return repr_js(v,line,b)}).join('')}
pr(forms)
var line = [1]
return '#!/usr/bin/env node\n'+mrj(forms).replace(/^ /gm,'').replace(/^(.*)\n/,'//$1')}


var reader_or = extend_function(function λ(v,b,c){return function λ(start,s,line){return (λ[s[0]]? λ[s[0]](start+s[0],s.slice(1),line) : null) || (λ['']? λ[''](start,s,line) : null)}})
reader_or.prototype.get = function λ(s){return this[s[0]]? (this[s[0]] instanceof reader_or? this[s[0]].get(s.slice(1)) : this[s[0]]) : null}
reader_or.prototype.set = function λ(ss,r){
seq(ss).map(function λ(s){
var c = s === ''? '' : s[0]; var s = s.slice(1)
if (s !== '')(this[c] instanceof reader_or? this[c] : this[c] = new reader_or().set([''],own(this,c))).set([s],r)
else delset(this,c,r)}
.bind(this)); return this}

var string_reader = function λ(start,s,line){
var r = ''
for (;;){
var c = s[0]; s = slice_eof(s,1)
if (c === start) return [r,s,line]
if (c === '\\'){
var c = s[0]; s = slice_eof(s,1)
switch (c){
case "'": case '"': case '\\': r += c; break
case 'n': r += '\n'; break
case 't': r += '\t'; break
case 'x': r += chr(parseInt(s.slice(0,2),16)); s = slice_eof(s,2); break
case 'u': r += chr(parseInt(s.slice(0,4),16)); s = slice_eof(s,4); break
_default: r += '\\'+c; break }}

else if (c === '\n'){line++; if (r !== '') r += '\n'}
else r += c }}

var slice_eof = function λ(s,l){if (s.length < l) throw 'EOF while reading string'; return s.slice(l)}
var regex_reader = function λ(start,s,line){
var t = s.match(/^((?:[^\/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*\/[a-z]*)/)
if (!t) throw 'could not match regex: '+start+s.slice(0,10)
return [eval('/'+t[1]),s.slice(t[1].length),line]}

var reader_macros = new reader_or()
reader_macros.set(['//'], function λ(v,b,c){return [SP,b.replace(/^.*/,''),c]})
reader_macros.set(['/*'], function λ(v,b,c){return [SP,b.replace(/^[^]*?\*\//,''),c]})
reader_macros.set(' \t\u000c\u000d', function λ(v,b,c){return [SP,b,c]})
reader_macros.set('\n', function λ(v,b,c){return [SP,b,c+1]})
reader_macros.set(seq('()[]{}\u2039\u203a.`~?:;,').concat(['~@']), function λ(v,b,c){return [S(v,c),b,c]})
reader_macros.set(_.range(0,0x80).map(chr).filter(function λ(v,b,c){return v.match(/[a-zA-Z0-9_$%]/)}), function λ(c,s,l){var r = s.match(/^[a-zA-Z0-9_$%]*/)[0]; return [S(c+r,l),s.slice(r.length),l]})
reader_macros.set([''], function λ(c,s,l){var r = c; while (!reader_macros.get(s)){r += s[0]; s = s.slice(1)} return [S(r,l),s,l]})
reader_macros.set('\'"', string_reader)
reader_macros.set(['~'+'/'], regex_reader)

var groups = {'(':')','[':']','{':'}','\u2039':'\u203a'}

var lex = function λ(s){var r = []; var line = 1; while (s !== ''){var form = reader_macros('',s,line); r.push(form[0]); s = form[1]; line = form[2]} return r}
var group = function λ(g,l){
if (l === undefined){var r = group(S('('),g.concat([S(')')])); if (r[1].length > 0) throw '<what>'; return r[0].slice(1)}
else {
var e = groups[g.v]
var r = [g]; for (;;){
if (l.length === 0) throw 'unfinished group'+repr_js(r)
if (l[0].v === e) return [r,l.slice(1)]
while (l[0] instanceof Symbol && own(groups,l[0].v)){var t = group(l[0],l.slice(1)); r.push(t[0]); l = t[1]}
if (l[0].v === e) return [r,l.slice(1)]
r.push(l[0]); l = l.slice(1)}}}

var read = function λ(s){
var r = [SP];
var t=null; if (t = s.match(/^#!.*/)){r.push(S('__literal__'),S('('),t[0],S(')')); s = s.slice(t[0].length)}
var r = r.concat(lex(s)); r.push(SP)
for (var i=1;i<r.length-1;i++) if (r[i] instanceof Symbol){
if (r[i-1] === SP) r[i].space_before = true
if (r[i+1] === SP) r[i].space_after = true }
var r = r.filter(function λ(v,b,c){return v !== SP})
var r = group(r)
return r}

var compile_f = function λ(ǂ_in,out){fs.writeFileSync(out,repr_js_file(read(fs.readFileSync(ǂ_in).toString())))}

compile_f(process.argv[2].replace('.a','.α'),process.argv[3])

print('--- ran as:',ran_as,'---')